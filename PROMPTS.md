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

do not put an underscore in ANY ingredient like:

6 garlic cloves = @garlic cloves{6}
1/2 cup of pinto beans = @pinto beans{1/2%cups}

With a recipe that is just a list of ingredients, such as:

lemongrass chicken

2T fish sauce
1T oyster sauce
1/2 t red pepper
2t sugar
2 shallots
3 garlic
2 stalk lemongrass
2t lime zest (lime leaves)
700 grams chicken boneless

mix all ingredient in food processors, marintate overnight
Using grill pan, grill for several minutes until charred
Let rest 20 minutes

DO NOT do something like this:

@fish_sauce{2%T}
@oyster_sauce{1%T}
@red_pepper{1/2%tsp}
@sugar{2%tsp}
@shallots{2}
@garlic{3}
@lemongrass{2%stalk}
@lime_zest{2%tsp} (lime leaves)
@chicken{700%grams} (boneless)

1. Mix all ingredients in a food processor, marinate overnight.
2. Using a grill pan, grill for several minutes until charred.
3. Let rest for ~{20%minutes}.

Rather do this:

Mix @fish sauce{2%T}, @oyster sauce{1%T}, @red pepper{1/2%tsp}, @sugar{2%tsp}, @shallots{2}, @garlic{3}, @lemongrass{2%stalk}, @lime zest{2%tsp} (lime leaves), @chicken{700%grams} (boneless)} in a food processor, marinate ~{24%hours}
... etc

Be sure not to convert the list of ingredents into a list of just ingredeients

2T fish sauce
1T oyster sauce
1/2 t red pepper
2t sugar
2 shallots
3 garlic
2 stalk lemongrass
2t lime zest (lime leaves)
700 grams chicken boneless

should really not exist, it should be just the ingredients, inline with the stpes

Here is the recipe to convert:
