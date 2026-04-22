#!/bin/bash
# Grade all recipe outputs against assertions

grade_recipe() {
    local recipe_file="$1"
    local output_file="$2"
    local recipe_name="$3"

    if [ ! -f "$recipe_file" ]; then
        echo "SKIP: $recipe_file not found"
        return
    fi

    local content
    content=$(cat "$recipe_file")

    local no_ingredient_list=true
    local no_underscores=true
    local valid_syntax=true
    local has_metadata=true
    local has_timers=true
    local concise_steps=true
    local yaml_frontmatter=false
    local has_sections=false

    # 1. No underscores in ingredient names (@word_word)
    if echo "$content" | grep -qE '@[a-zA-Z]+_[a-zA-Z]+'; then
        no_underscores=false
    fi

    # 2. Valid CookLang syntax - check @ingredient{...} pattern
    if ! echo "$content" | grep -qE '@[a-zA-Z].*\{'; then
        valid_syntax=false
    fi

    # 3. Has metadata
    if ! echo "$content" | grep -qE '(^---|^>>)'; then
        has_metadata=false
    fi

    # 4. Has timers
    if ! echo "$content" | grep -qE '~\{'; then
        has_timers=false
    fi

    # 5. Uses YAML front matter
    if echo "$content" | head -1 | grep -q '^---'; then
        yaml_frontmatter=true
    fi

    # 6. Uses CookLang sections (= or ==)
    if echo "$content" | grep -qE '^=+ '; then
        has_sections=true
    fi

    # 7. Concise steps - check if any line is over 300 chars
    local long_lines
    long_lines=$(echo "$content" | awk 'length>300' | wc -l | tr -d ' ')
    if [ "$long_lines" -gt 0 ]; then
        concise_steps=false
    fi

    # 8. No standalone ingredient list (3+ lines starting with @)
    local consecutive=0
    local max_consecutive=0
    while IFS= read -r line; do
        if echo "$line" | grep -qE '^\s*@'; then
            consecutive=$((consecutive + 1))
            if [ $consecutive -gt $max_consecutive ]; then
                max_consecutive=$consecutive
            fi
        else
            consecutive=0
        fi
    done <<< "$content"
    if [ $max_consecutive -ge 3 ]; then
        no_ingredient_list=false
    fi

    cat > "$output_file" <<EOJSON
{
  "recipe": "$recipe_name",
  "expectations": [
    {"text": "No standalone ingredient list", "passed": $no_ingredient_list, "evidence": "Max consecutive @-starting lines: $max_consecutive"},
    {"text": "No underscores in ingredient names", "passed": $no_underscores, "evidence": "Checked for @word_word pattern"},
    {"text": "Valid CookLang ingredient syntax", "passed": $valid_syntax, "evidence": "Checked for @name{} patterns"},
    {"text": "Has metadata block", "passed": $has_metadata, "evidence": "Checked for --- or >> at start"},
    {"text": "Uses timers", "passed": $has_timers, "evidence": "Checked for ~{} pattern"},
    {"text": "Concise steps (under 300 chars per line)", "passed": $concise_steps, "evidence": "Found $long_lines lines over 300 chars"},
    {"text": "Uses YAML front matter (not >> style)", "passed": $yaml_frontmatter, "evidence": "First line starts with ---: $yaml_frontmatter"},
    {"text": "Uses CookLang sections", "passed": $has_sections, "evidence": "Found = Section lines: $has_sections"}
  ]
}
EOJSON
    echo "Graded: $recipe_name"
}

BASE="/Users/stefan/.claude/skills/cooklang-recipe-workspace/iteration-1"

for eval_dir in pad-thai beef-bourguignon milk-bread; do
    for variant in with_skill without_skill; do
        recipe="$BASE/$eval_dir/$variant/outputs/recipe.cook"
        output="$BASE/$eval_dir/$variant/grading.json"
        grade_recipe "$recipe" "$output" "$eval_dir-$variant"
    done
done
