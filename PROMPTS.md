using cooklang (https://cooklang.org/docs/spec/). we are going to conver recipes from plain text to cooklang.

the rules for cooklang are the following:

Igredients are formated as follows:
2 cups of rice = @rice{2%cups}
1/2 onion = @onion{1/2}
1/2tsp cumin = @cumin{1/2%tsp} e

The recipe is formated as follows:
fry 2 cups of rice in lard (3-4tbs) until golden
becomes:
Fry @rice{2%cups} in @lard{4%tbs} until golden

Add the tomato sauce to the rice and let it boil
becomes:
Add the tomato sauce to the rice and let it boil (no change bc there are no units in the line)

cover and let it cook in over for 25 minutes at 180C
becomes:
Cover and let it cook in over for ~{25%minutes} at 180°C

Blend 3 tomatoes with 1/2 onion, 1 garlic clove, 1/2tsp cumin, 2tsp chicken bullion, 1tsp salt and water until is 4 cups total

becomes:
Blend @tomatoes{3} with @onion{1/2}, @garlic clove{1}, @cumin seed{1/2%tsp}, @chicken_bullion{2%tsp}, @salt{1%tsp} and water until is 4 cups total

do not put an underscore it things like:

6 garlic cloves = @garlic cloves{6}

Here is the recipe to convert:
