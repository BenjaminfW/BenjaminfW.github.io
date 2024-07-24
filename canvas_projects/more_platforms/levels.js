/* levels is an array of objects
*  The function startLevel() in game.js reads in an object entry
* and puts it into the game object, which is referenced by pretty
* much everything.
*  Every level object should have the following:
*
* starting_point: array of length 2
*   - This is where the player spawns in
*   - Element 1 is the x coordinate and 2 is the y
*
* end_point: array of length 2
*   - I forget what this is
*
* floor: integer
*   - must be greater than starting_point[1]
*   - ground point at which the player stops falling
*
* kill_floor: integer
*   - absolutely must be greater than starting_point[1]
*   - ground point at which the player dies
*
* platforms: list of lists of length 3
*   - Each element is used to construct Platform objects
*       - In each list...
*       - Element 1 is the x coordinate of the platform
*       - Element 2 is the y coordinate
*       - Element 3 is the width
*
* Dplatforms: list of lists of length 4
*   - Each element is used to construct PlatformDiagonal objects
*       - In each list...
*       - Element 1 is the x coordinate of the platform
*       - Element 2 is the y coordinate
*       - Element 3 is the width
*       - Element 4 is the angle
*
* Mplatforms: list of lists of length 6
*   - Each element is used to construct PlatformMoving objects
*       - In each list...
*       - Element 1 is the x coordinate of the platform's first point
*       - Element 2 is the y coordinate
*       - Element 3 is the x coordinate of the platform's second point
*       - Element 4 is the y coordinate
*       - Element 5 is the width
*       - Element 6 is the speed at which the platform moves between
*           point 1 and point 2
*
* walls: list of lists of length 3
*   - Each element is used to construct Wall objects
*       - In each list...
*       - Element 1 is the x coordinate of the wall
*       - Element 2 is the y coordinate
*       - Element 3 is the height of the wall
*
*
*  platforms, Dplatforms, Mplatforms, and walls are all allowed to be
* empty. But you're not going to have much of a level without anything
*/

const levels = [

    {
        starting_point: [50,0],
        end_point: [1000,0],
        floor: 1000,
        kill_floor: 500,
        platforms: [
            [0,10, 100]
        ],
        Dplatforms: [
            [100,10, 100, Math.PI/3],
            [250,10, 100, -1*Math.PI/4],
            [400,10, 100, Math.PI/8],
            [550,10, 100, Math.PI/5],
            [700,10, 100, -1*Math.PI/6]
        ],
        Mplatforms: [],
        walls: [],
        ceilings: []
    },

    {

    starting_point: [50,400],
    end_point: [2000, 400],
    floor: 1200,
    kill_floor: 1000,
    
    platforms: [
                [ 50,410,100],
                [400,200, 50],
                [700,100, 75],
                [620,160, 10],
                [700,  0,100],
                [1000,-500,100]],
    Dplatforms: [
                 [200,300,150,Math.PI/4],
                 [800,143,120,-1*Math.PI/4],
                 [1100,-500,200,-1*Math.PI/10],
                 [700,-100,50,Math.PI/10],
                 [900,230,150,Math.PI/6]],
    Mplatforms: [
                 [900,0,950,-300, 50,2],
                 [1000,120,1800,120, 50,3]],
    walls: [
            [0,0,1000],
            [2000,0,1000],
            [700,100,40],
            [950,-400,100]],
    ceilings: [
               [700,0, 100]
    ]


    },


    {
        starting_point: [10,0],
        end_point: [500,0],
        floor: 200,
        kill_floor: 150,

        platforms: [
            [0,10, 1000],
            [0,-250, 250]
        ],
        Dplatforms: [],
        Mplatforms: [],
        walls: [
            [250,-1000,1010]
        ],
        ceilings: []
    },

    {
        starting_point: [0,0],
        end_point: [500,0],
        floor: 10,
        kill_floor: 50,

        platforms: [
            [-5,10,1000]
        ],
        Dplatforms: [
            [30,10, 100, Math.PI/6],
            [150,-75, 100, -1*Math.PI/5],
            [300,-20, 100, Math.PI/4]
        ],
        Dplatforms: [],
        Mplatforms: [],
        walls: [],
        ceilings: [[0,-30, 500]]
    }

];
