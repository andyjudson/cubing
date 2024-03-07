## cubing project

based on cubing.js

    https://github.com/cubing/cubing.js
    https://js.cubing.net/cubing
    https://js.cubing.net/cubing/twisty/
    https://js.cubing.net/cubing/api/index.html
    https://experiments.cubing.net/cubing.js/twisty/twisty-player-config.html
    https://experiments.cubing.net/cubing.js/twisty/mkbhd.html
    https://scramble.cubing.net/
    https://alpha.twizzle.net/edit/
    https://alpha.twizzle.net/explore/



## dev env setup



Andy@MACTHOR TechLab % brew install npm

Andy@MACTHOR TechLab % npm install cubing

    ...

    Andy@MACTHOR TechLab % npm instalL cubing
    (node:33637) [DEP0174] DeprecationWarning: Calling promisify on a function that returns a Promise is likely a mistake.

    (Use `node --trace-deprecation ...` to show where the warning was created)

    changed 1 package, and audited 14 packages in 2s

    ...

Andy@MACTHOR TechLab % npm install agentkeepalive

    Andy@MACTHOR TechLab % npm install agentkeepalive
    (node:34037) [DEP0174] DeprecationWarning: Calling promisify on a function that returns a Promise is likely a mistake.
    (Use `node --trace-deprecation ...` to show where the warning was created)

    added 3 packages, and audited 4 packages in 511ms

    found 0 vulnerabilities

Andy@MACTHOR TechLab % npm create --yes cubing-app@latest my-cubing-project



    (node:34092) [DEP0174] DeprecationWarning: Calling promisify on a function that returns a Promise is likely a mistake.
    (Use `node --trace-deprecation ...` to show where the warning was created)
    ---------------------------------
    Creating a cubing project in the following folder:
    my-cubing-project

    Your cubing app has been created.
    To work on it, run:

        cd "my-cubing-project"
        npm run dev

    Edit the files in `src` and open the displayed URL in browser to see changes.

    --------

    To create an optimized build of your app that can be uploaded to a file server, run:

        npm run build

    When a new version of `cubing.js` is released in the future, you can upgrade using:

        npm install --save cubing@latest





## dev research

Useful example cubing apps:

- Rubik’s Cube image generator code = https://github.com/tdecker91/visualcube OR https://tdecker91.github.io/puzzlegen-demo/
- Rubik’s Cube solver visualisation code = https://github.com/cubing/cubing.js
- Rubik’s Cube explorer = https://iamthecu.be OR https://stewartsmith.io/work/rubiks-cube
- Twizzle editor web app (based on cubing.js) = https://alpha.twizzle.net/edit/ OR https://alg.cubing.net/
- Apple iOS app “CFOP” (good, minimal ui, with clear algorithms, with animations, and breaks algorithms up into beginner / advanced subsets = https://apps.apple.com/gb/app/cube-cfop/id1236657805
- Apple iOS app “CubeTime” = https://apps.apple.com/gb/app/cubetime/id1600392245
- Apple iOS APP “Su CFOP” (good, minimalist ui, with algorithms, with animation integration, but in Chinese, and doesn’t break up the algorithms into beginner / advanced) = https://apps.apple.com/gb/app/su-cfop/id1543854959



Useful cubing open source frameworks:

- https://github.com/cubing/cubing.js
- https://github.com/cubing/timer
- https://github.com/kyo-takano/efficientcube
- https://github.com/kyo-takano/alphacube
- https://github.com/forestagostinelli/DeepCubeA
- https://github.com/aduryagin/Fridrich-CFOP [andriod only / but could use resources]
- https://github.com/megocoding/CubeCFOP [see apple iOS app … using this, but sadly this is not the actual app code]
- https://github.com/kash/cubedesk [see web app below … looks pretty cool]
- https://github.com/tdecker91/puzzle-gen
- https://basilio.dev/cubing
- https://www.cubedesk.io
- https://www.cubers.io/
- https://observablehq.com/@onionhoney/how-to-model-a-rubiks-cube
- https://medium.com/@nicholasrogers_98170/building-a-rubiks-cube-in-react-three-js-and-good-ole-javascript-96649d1172d9
- https://bsehovac.github.io/the-cube/
- http://algdb.net/puzzle/333
- https://speedcubedb.com/a/3x3
- https://www.cuberoot.me/popular-cfop/




Useful web or iOS app frameworks:

- https://pages.github.com
- https://nodejs.org
- https://threejs.org
- https://react.dev
- https://www.typescriptlang.org
- https://getbootstrap.com
- https://get.foundation
- https://fontawesome.com
- https://feathericons.com
- https://www.flaticon.com
- https://icons.cubing.net
- https://fonts.google.com








## dev ideas


- ideas 

    - using algorithm trainer from cfop app (really good library of algorithms + generated cube images + minimalist styling)
    - integrate with twizzle (cubing.js) to provide animation of each algorithm, but integrate + modernise the style (rather than the pop out to web page)
    - integrate timer + stats tracking (see cubing-timer or cubedesk)
    - build as web or iOS app
    - use  jperm beginner cfop algorithms + examples + links to YouTube tutorials
    - use cubehead’s beginner cfop algorithms for f2l + 2-look oll & pll tutorials ( https://youtube.com/playlist?list=PLqrfspOsG9B-zqJu9f-45BZRamipy-q2y&si=FgN_Txk_-uyO9WFZ ). He also seems to use the algorithm set from CubeSkills - Learn To Solve the Rubik's Cube


- work on page styling + design

    - dark background + layout + fonts + icons
    - disable reflection hints by default but allow user to enable
    - customize control styling
    - generate scramble button + solve button
    - speed control + play pause step fwd / rwd

- tutorial build out

    - json file to store case description + styling + algorithm ... use to build a collection of algorithm tutorials that can then easily play
    - beginner cfop based on cubehead tutorial series (cross, f2l, 2-look oll + 2-look pll)
    - beginner solve cubehead (see his latest video) + jperm tutorials (see his original videos which is how i started + see crib sheet in apple notes)
    - advanced cfop algorithms








## log of working notes


2024/04/06

    from javascript console, try running ```app.updateScramble()```

    i've tried setting ```visualization="PG3D"``` which changes the style but for some reason stops animation from working, alternative approach would be leaving as default which is 3D and then use styling of colours and controls

            Unhandled Promise Rejection: TypeError: Attempted to assign to readonly property.

            ...

            >> reinstalled cubing via npm, now works ... but suspect related to promise code deprecation warnings

    see "2D LL visualization" example ... with no background or controls, with anchor set to end or start, to support puzzle image examples, or can generate screenshot export from the actual puzzles

    see "Stickering" examples for show casing algorithms steps

    tempo scale = 0.1 to 6.0

    want to swap white + yellow layers ... confusing with default setup w. algorithms using white up!

    see guide from liucas garron on using cubing.js to create scramble page

        https://www.youtube.com/watch?v=EE0mzwPBFAU&list=PLLNimX31VC-nhxSNCtswq2_euMFp_CAvv&index=17

    shoudln't need to use "setup" instead just have algorithm and anchor at end

    still want to find or generate 2d svg or screenshots if have to for each algorithm so can use these in a draw grid of algorithms, that select from to then play in main cube


    add custom controls + trigger random scramble on space / button / refresh

    add styling of algorithm highlight + navigation



## common triggers 

It is easier to memorize algorithms using "triggers", which are short and reoccuring sequences of moves. The most common ones are:

    - Sledge = (R' F R F')
    - Hedge = (F R' F' R)
    - Sexy = (R U R' U')
    - Inverse Sexy = (U R U' R')
    - Su = (R U R' U)
    - Ne = (R U2 R')
    - ZigZag = (R U R U')

Others i've used from jperm beginner method

    - Sune = (R U R' U R U2 R')
    - Niklas = (R U' L' U R' U' L)

Most algorithms begin by taking one pair out (often front-right or front-left), doing something with it and then putting it back. to memorise the entire alg more easily, try following what is happening to that pair.



## beginner f2l algorithms based on cubehead video (https://youtu.be/ReOZZHscIGk?si=eRZJS2B_71FDc9qH)


f2l "first two layers" overview

    - find a pair
    - setup easy inserts (pairs in top layer + disconnected)
    - solve pair in correct slot

Most algorithms are setup moves for "free pairs" which are 3 move inserts. Some algorithms are setup moves for other, shorter inserts. Most of the cases can be solved without a rotation, while the rest are solved with a single rotation.


stickering = f2l


1. easy solves (simple pairs + inserts)


case 1. righty pair (easy insert)

    setup = F R' F' R
    algorithm = U R U' R'
    plain english = push pair aside, open slot where needs to go, insert pair, close slot

case 2. lefty pair (easy insert)

    setup = R' F R F'
    algorithm = U' F' U F
    plain english = push pair aside, open slot where needs to go, insert pair, close slot

case 3. righty insert (disconnected pairs w. different colours facing up, above target spot, white facing right)

    setup = R U' R' 
    algorithm = R U R'

case 4. lefty insert (disconnected pairs w. different colours facing up, above target spot, white facing left)

    setup = F' U F 
    algorithm = y L' U' L


2. fix orientation (stuck in-slot or connected pieces)


case 1. edge stuck in middle layer (hold middle to the right + corner to the left of top layer)

    setup = F' U F U' R U' R' U2
    algorithm = R U R' ...
        - this moves just puts pair into top layer and disconnected
        - then use an easy insert

case 2. corner stuck in bottom layer (hold corner to the right + edge to the left of top layer)

    setup = F' U' F U R U R'
    algorithm = R U R' ...
        - this move just puts pair into top layer and disconnected
        - then use an easy insert

case 3. pair stuck in slot (but not solved)
    
    setup = R U' R U2' F R2' F' U2' R2'
    algorithm = R U' R' ...
        - pair taken out and disconnected

case 4. edge pieces connected in top layer (hold corner on right, over unsolved slot)

    setup = F' U F U' R U2' R' U
    algorithm = R U2 R' ...
        - keeps pair in top layer but now disconnected


3. solve pairs in correct target slot

    1. find the correct slot
    2. then look at the corner - either white faces to one of the sides or up
    3. if white face to the side, hold corner above the target slot
    4. turn upper layer once so can still see the white face - "where is white?"
    5. then look at the top colours of the corner edge pair
    6. if same colour ... pair
        1. put corner to safety
        2. edge in target spot to be next to the corner
        3. bring corner back up
        4. solve with easy "L/R pair"
    7. if different colour ... across
        1. put corner to safety
        2. edge in target spot to be across from the corner
        3. bring corner back up 
        4. solve with easy "L/R insert"
    8. if white face up ...
        1. align edge
        2. bring edge to safey (turn away slot)
        3. bring corner above edge
        4. realign cross
        5. solve with easy "L/R pair"




## beginner oll (2-look) algorithms based on cubehead video (https://youtu.be/6PSBaxlBqRg?si=vJvGWCArsxBLXBA5)

oll (orientation of last layer)

goal = create a yellow face after finishing f2l

use visualization = "experimental-2D-LL" with control panel hidden for images, or export screenshot via twizzle
use stickering = "oll" for animations

use case to algorithms, but 57 cases in total, instead we can use 9 algs for 2-look oll

Most algorithms begin by taking one pair out (often front-right or front-left), doing something with it and then putting it back. To memorise the entire alg more easily, try following what is happening to that pair.



1. create yellow cross (orient edges)

case 1: "line" (hold it horizontal)

    setup = F U R U' R' F'
    algorithm = F (R U R' U') F' ... which uses "sexy" trigger
    probability = 1/4
    

case 2: "hook" (hold it bottom right and use "sexy" trigger with wide front face rotations)

    setup = f U R U' R' f'
    algorithm = f (R U R' U') f'
    probability = 1/2

    ... or hold it top left and use "inverse sexy = F (U R U' R') F'

case 3: "dot"

    setup = f U R U' R' f' F U R U' R' F'
    algorithm = F (R U R' U') F' f (R U R' U') f' 
    probability = 1/8

case 4: "edges orientated"

    probability = 1/8



2. solve yellow layer (orient corners)

case 1: "sune" (yellow fish in bottom left, with yellow face front right)

    setup = R U2' R' U' R U' R'
    algorithm = (R U R' U) (R U2 R')
    probability = 4/27
    plain english = take out the pair, realign the cross, put it in the back, open the slot again, reinserting it and closing it again

case 2: "anti-sune" (yellow fish top right, with yellow face front left)

    setup = R U R' U R U2' R'
    algorithm = (R U2 R') (U' R U' R')
    probability = 4/27

case 3: "cross 1 / H" (headlights left + right)

    setup = R U2' R' U' R U R' U' R U' R'
    algorithm = (R U R' U) (R U' R' U) (R U2 R')
    probability = 2/27
    plain english = ??

case 4: "cross 2 / Pi" (headlights on left with yellow side lights on right facing outwards)

    setup = R' U2' R2' U R2' U R2' U2' R'
    algorithm = R U2 (R2' U') (R2 U') (R2' U') U' R
    probability = 4/27


case 5: "chameleon / T"  (yellow block on right with yellow side lights on left facing outwards)

    setup = F R' F' r U R U' r'
    algorithm = (r U R' U') (r' F R F')
    probability = 4/27


case 6: "kite / L" (yellow two diagonal corners facing up, with yellow face bottom right facing you)

    setup = R' F' r U R U' r' F
    algorithm =  F' (r U R' U') (r' F R)
    probability = 4/27


case 7: "headlights / U" (yellow block facing back, with headlights facing forward)

    setup = R U2' R D R' U2' R D' R2'
    algorithm = R2 D (R' U2 R) D' (R' U2 R')
    probability = 4/27

case 8: "corners orientated"

    probability = 1/27


## beginner pll (2-look) algorithms based on cubehead video (https://youtu.be/ZC9nwou59ow?si=mtNsiETeu_qt7QEy)

pll (permutation of last layer)

use visualization = "experimental-2D-LL" with control panel hidden for images, or export screenshot via twizzle
use stickering = "pll" for animations

1. corner permutation

2. edge permutation 