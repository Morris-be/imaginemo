## Crackme.nix Writeup
Challenge Author: Localo  
Challenge difficulty: Hard  
Challenge Files: [here](https://morrisbe.de/challenge_files/crackme-nix.zip)  
Challenge description:  
```
Welcome to pure functional madness! This challenge may be a bit different from what you're used to. But don't worry, it's just a simple crackme ;) Oh, did I mention that it's written in Nix? Good luck! 

The challenge needs more stack than some distros provide and more than Nix allows by default, it should work with the following command!

docker run --rm -it --ulimit stack=2147483648:2147483648 -v "$(pwd)/crackme.nix:/crackme.nix" nixos/nix:2.26.1 \
  bash -c "nix-instantiate --option max-call-depth 1000000000 --eval /crackme.nix --argstr flag '<flag_here>'"
```
### Table of Contents

### Summary
This challenge consists of reverse-engineering a Nix-based crackme that validates an input flag.
Input validation involves converting the flag into char code, applying bitwise operations, and a modified, 32 round XTEA cipher. The vulnerability lies in the non-destructiveness of the utilized bit-operations meaning they can simply be reversed to determine a valid input if we know the valid output.
### Challenge Overview
The material provided for crackme.nix consists "only" of one single file named crackme.nix. 
While the challenge description luckily spoils this, the first small goal was figuring out that the challenge is written in Nix.  

"_Nix_ is a tool that takes a unique approach to package management and system configuration." [Nix](https://nixos.org/)

That is pretty much enough introduction to Nix, we don't really need to know what Nix generally is, we just need to know that we are working with a functional programming style and that Nix has a bunch of primitive built-in functions. These functions include operations such as add, sub, and div that we know from other programming languages. 

To see what the program does, we install [Nix](https://nixos.org/download/) and run the command provided from the challenge description with a random flag input. The program outputs `incorrect flag :(`, so our guessed input is wrong.

While knowing that it's Nix seems great in practice, as soon as you open the crackme.nix file, you are met with an absolute wall of seemingly random text. Most of it consists of the following:
```  
hiegha5W = [...] [
    eeShief9
    aZalahl3
    eiy1Chui
    uzoeW9au
    aZalahl3
    wom2Ohku
    ioNgoo2k
    aZalahl3
    eeShief9
    # (continues for ~56,000 lines)
]
```
Sequences of 8 long characters repeat for exactly 56,136 lines in this array definition... However, we are fortunate to have 40 lines of code before this huge array and 242 lines after with more structure. Not so fortunate is that these lines also seem very obfuscated.
### Revealing The Built-ins
Looks a lot like your typical code, but all variable and function names are completely obfuscated.
```
 bingee9B = {
	...
    Et0odohz = yah6ni6D "2b6ba[...]9d1a";
    ADu9AD5I = yah6ni6D "eafe8[...]8918";
    ahse8ueB = yah6ni6D "29df0[...]f458";
    # (21 total lines)
}
```
Part of all that randomness is this block of 21 hashes. Using [Cyberchef's](https://gchq.github.io/CyberChef/#recipe=Analyse_hash()&input=OWUwNjg5NjI2YTFlMDJmZmE0MjVhNGFjMGZmMjMzMjhmZDJmYjdkZWFlMmY3NmM4MmFkMGQ5ZGU3OTJkNThiYQ) hash analysis tool or finding the clear text "sha256" in the given lines, we figure out that these are sha256 hashes. For very short input values, [brute force](https://10015.io/tools/sha256-encrypt-decrypt) is enough to reveal what led to the hash. Brute force revealed `eafe8[...]0ac0 = trace`. Searching the Nix documentation for `trace` leads us to the [built-in Nix functions documentation](https://nix.dev/manual/nix/2.18/language/builtins). We hash a bunch of the built-in function names and compared the result to those provided to figure out all 21 present built-ins: 
```
bingee9B = {
    ADu9AD5I = yah6ni6D "eafe8[...]0ac0"; #trace
    ahse8ueB = yah6ni6D "32e15[...]f40f"; #fromJSON
    aiCoo0ph = yah6ni6D "9f2e6[...]924d"; #head
    au9ooKaa = yah6ni6D "0c62f[...]e1d7"; #tail
    die0Aemi = yah6ni6D "2b9c5[...]22c6"; #substring
    eag0eiJu = yah6ni6D "1b8ff[...]4528"; #foldl'
    ee9Deike = yah6ni6D "1a1cd[...]31db"; #bitAnd
    EiThohw9 = yah6ni6D "2b6ba[...]9d1a"; #stringLength
    Et0odohz = yah6ni6D "9e068[...]58ba"; #bitXor
    Fotea9ah = yah6ni6D "29df0[...]f458"; #mul
    geeJ0fez = yah6ni6D "ddc6e[...]6d6a"; #sub
    iiV8Em3u = yah6ni6D "60be9[...]d8e8"; #map
    Mei2kohw = yah6ni6D "7e9e5[...]4767"; #add
    ohR3phie = yah6ni6D "bbb52[...]2ca2"; #toString
    phee1Aid = yah6ni6D "7344a[...]e8d1"; #listToAttrs
    seecohJ8 = yah6ni6D "fe64b[...]7ca4"; #hasAttr
    sha1Kaa8 = yah6ni6D "2265d[...]3b3d"; #attrNames
    Tohy5uez = yah6ni6D "cd35a[...]a364"; #div
    Uwae2iet = yah6ni6D "0f82a[...]947d"; #length
    Wa0phoo2 = yah6ni6D "16055[...]ac13"; #elemAt
    Xu4coh1L = yah6ni6D "da493[...]18e6"; #genList
  };
```
Now we know what each hash is!

However, `ADu9AD5I` etc. still have a `yah6ni6D` on the right side of the expression `ADu9AD5I = yah6ni6D "eafe8[...]0ac0";` So what does that function do? 
We Ctrl-f in the file and find this:
```
yah6ni6D =
    with builtins;
    iu5ohQue:
    builtins.${head (filter (If3kaef1: hashString "sha256" If3kaef1 == iu5ohQue) (attrNames builtins))};
```
Turns out we were here before! This is where the clear-text "sha256" is located. All this code is doing is building the built-in that is described by its name by checking a lookup table of the hashes of the built-ins.  As a result, `ADu9AD5I`for instance, can just be replaced with `trace` everywhere.

Let's do the same thing for all other built-ins too.

Those 282 lines have become a lot more readable! Now we need to figure out what the heck is going on. A first hunch, due to the long center array with values that often repeat, is that some sort of state machine is working on a bunch of instructions.

### The State Machine
Perhaps a quick example:
We have a state machine that stores its state in an array: 
`[a, b, c]`
We can access each of the state values with their indices. For instance `[0] = a`.
Now we have the instructions:
```
add [0] [1]
sub [0] [2]
# First value is the function and the rest are arguments (functional programming)
```
The state machine processes each instruction line by line. The first instruction adds element `[0] = a` with element `[1] = b` and stores the result back in `[0]`. This means `[0] = a + b`.
The same goes for the second instruction. `[0] = [0] - [2]`, which is equivalent to `[0] = (a+b) - c`. Notice that  `a+b` was calculated in the previous instruction. The new state is now:
`[a + b - c, b, c]`

All right, let's ensure that this hunch is true and go over all the internal workings of the machine. Such a state machine needs multiple things to work correctly, and in crackme.nix, the creator decided to use a dictionary (Eidoo6ba) similar to the one we introduced previousl,y as the keys are simply numbers, and additionally a stack (Oori9Lie) for processing. The machine also has a counter (Jil0leep), counting which instruction we are at. Since the huge center array likely represents the instructions, the counter will help us determine which instruction we are processing next. This counter is initially set to 0 (zeiY0ru5). 
```
(puph7Oop {
  Jil0leep = zeiY0ru5;
  Oori9Lie = [ ];
  Eidoo6ba = { };
  qua4Bael = yiGiw1oo flag;
}).Jil0leep
```
Let's replace all those variables to make it nicer to look at:
```
(puph7Oop {
  mCOUNT = 0;
  mSTACK = [ ];
  mSTATE = { };
  mINPUT = yiGiw1oo flag;
}).mCOUNT
```
We are left wondering what `puph7Oop` is and what the hell `yiGiw1oo` does to our user input flag...
To stick to the explanation of the machine, let's first understand `puph7Oop`. To do this, we first find the function definition with Ctrl-f. 
*Note: the local variables a,b,c, which are essentially local variables in nix function definitions, were always random 8-character values too; I replaced them everywhere.*
```
  puph7Oop = a: if a.mCOUNT < 0 then a else aZooj8ox puph7Oop a;
```
There is some sort of recursion going on. `puph7Oop` takes an input `a` which is the entire `mOBJECT`. It just returns `mOBJECT` if `mCount` is less than 0. However, when it is greater than 0, it calls the function `aZooj8ox` with inputs `puph7Oop` (itself) and `mOBJECT`.

We need to figure out what `aZooj8ox` does. Ctrl-f for function definitions is definitely becoming a pattern:
```
  aZooj8ox = a: b: (elemAt hiegha5W b.mCOUNT) a b;
```
This is using the `elemAt` built-in to choose the element at mCOUNT from the array hiegha5W, which is that 56,136-element array making up most of the file. It then executes the command it finds with inputs a and b, which are once again puph7Oop and the `mOBJECT`. Each command adjusts the state machine as per its definition, then calls `puph7Oop a`again to ensure the next instruction executes. 

So here we are. We know we have a state machine.
### Converting Input Flag to Char Code
Let's get back to what  `mINPUT = yiGiw1oo flag;` does. 
The flag is simply the user input we provide. Following the trail using Ctrl-f quickly becomes extremely nested this time, so let's now work with debug traces in nix.
We wrap the function definitions with some trace as so:
```
yiGiw1oo = kui8Cae0:
  builtins.trace
    (builtins.toString (bingee9B.iiV8Em3u
      (Hi3taima: xaisu5Ie.${Hi3taima})
      (aHi5cahr kui8Cae0)))
    (bingee9B.iiV8Em3u
      (Hi3taima: xaisu5Ie.${Hi3taima})
      (aHi5cahr kui8Cae0));
```
When we run the file again with the fake flag `dach2025`, we get the following:
```
100, 97, 99, 104, 50, 48, 50, 53
```
This is simply the char code of `dach2025`. I didn't use traces in my initial solve, and instead followed the nested functions.

So we have our state machine, know what happens to the user input, but haven't reversed the functions in the huge center array yet.
### Reimplementing The State Machine
Reversing each function is fairly straightforward. We choose one, Ctrl-f for its definition, and try to understand what is happening. We then reimplement the function in Python. Subsequently, each Nix function name is replaced with that of the python function. E.g., `ahCee6ae` is replaced with `switch_first_two`, producing a new array of instructions. To have a working state machine in Python, a loop goes through the instructions of the huge array:
This is one such working state machine (it requires crackme.nix to be in the same directory):
```
mOBJECT = {
    "mCOUNT": 0,
    "mSTACK": [],
    "mSTATE": {},
    "mFLAG": [ord(char) for char in "dach2025"] #dachctf as a char code list
}

# Helper functions
# --------- Aevo7oof -----------
def get_element_state(key):
    return mOBJECT["mSTATE"].get(str(key), 0)
def increment_count():
	mOBJECT["mCOUNT"] += 1

# Machine Instructions
# --------- ahLab9ve -----------
def terminate_execution():
    mOBJECT["mCOUNT"] = -1

# --------- ahCee6ae -----------
def switch_first_two():
    increment_count()
    mOBJECT["mSTACK"][:2] = mOBJECT["mSTACK"][1], mOBJECT["mSTACK"][0]

# --------- aZalahl3 -----------
def push_to_stack():
    increment_count()
    mOBJECT["mSTACK"].insert(0, get_element_state("0"))

# --------- OhKie2uz -----------
def jump_instruction():
    mOBJECT["mCOUNT"] += get_element_state("0")

# --------- eeShief9 -----------
def dec_elem_0_state():
    increment_count()
    mOBJECT["mSTATE"]["0"] = get_element_state("0") - 1
    
# --------- ioNgoo2k -----------
def inc_elem_0_state():
    increment_count()
    mOBJECT["mSTATE"]["0"] = get_element_state("0") + 1

# --------- Jaenaela -----------
def flag_code_to_stack():
    increment_count()
    index = get_element_state("0")
    val = mOBJECT["mFLAG"][index] if 0 <= index < len(mOBJECT["mFLAG"]) else -1
    mOBJECT["mSTACK"].insert(0, val)

# --------- oLeirei3 -----------
def print_stack():
    increment_count()
    s = "".join(chr(x) for x in mOBJECT["mSTACK"])
    print(s) 
    mOBJECT["mSTACK"] = []

# --------- oom5Ach7 -----------
def nop_inc_count():
    increment_count()

# --------- uzoeW9au -----------
def state_to_list():
    increment_count()
    sorted_keys = sorted(mOBJECT["mSTATE"].keys(), key=lambda x: int(x))
    mOBJECT["mSTACK"] = [mOBJECT["mSTATE"][key] for key in sorted_keys]
    mOBJECT["mSTATE"] = {}
    
# --------- eiy1Chui -----------
def move_stack_to_state():
    increment_count()
    mOBJECT["mSTATE"] = {str(i): val for i, val in enumerate(mOBJECT["mSTACK"])}
    mOBJECT["mSTACK"] = []
# --------- wom2Ohku -----------
def pop_stack_to_zero_attribute():
    increment_count()
    first_val = mOBJECT["mSTACK"][0]
    mOBJECT["mSTACK"] = mOBJECT["mSTACK"][1:]
    mOBJECT["mSTATE"]["0"] = first_val

# --------- zeu10iyo -----------
def evaluate_operation_at_index_0_1(op):
    increment_count()
    first = mOBJECT["mSTACK"][0]
    second = mOBJECT["mSTACK"][1]
    val1 = get_element_state(first)
    val2 = get_element_state(second)
    mOBJECT["mSTATE"][str(first)] = op(val1, val2)
    mOBJECT["mSTACK"] = mOBJECT["mSTACK"][2:]

# --------- Aopixei9 -----------
def calc_bitXor():
    evaluate_operation_at_index_0_1(lambda a, b: a ^ b)

# --------- taeB3ohc -----------
def calc_bitAnd():
    evaluate_operation_at_index_0_1(lambda a, b: a & b)

# --------- va7iePei -----------
def calc_sub():
    evaluate_operation_at_index_0_1(lambda a, b: a - b)

# --------- vein1Enu -----------
def calc_add():
    evaluate_operation_at_index_0_1(lambda a, b: a + b)

# --------- GaYaeng3 && iK3ain3J -----------
def calc_shift_left():
    evaluate_operation_at_index_0_1(lambda a, b: a << b)

# --------- Aifee2iw && dii5aePi -----------
def calc_shift_right():
    evaluate_operation_at_index_0_1(lambda x, y: -1 if x < -1 else (x >> y))  

# All functions mapped to what they replace
instruction_remap = {
    "ahLab9ve": "terminate_execution",
    "ahCee6ae": "switch_first_two",
    "aZalahl3": "push_to_stack",
    "Ohkie2uz": "jump_instruction",
    "eeShief9": "dec_elem_0_state",
    "ioNgoo2k": "inc_elem_0_state",
    "OhKie2uz": "jump_instruction",
    "Jaenae1a": "flag_code_to_stack",
    "oLeirei3": "print_stack",
    "oom5Ach7": "nop_inc_count",
    "uzoeW9au": "state_to_list",
    "eiy1Chui": "move_stack_to_state",
    "wom2Ohku": "pop_stack_to_zero_attribute",
    "zeu10iyo": "evaluate_operation_at_index_0_1",
    "Aopixei9": "calc_bitXor",
    "taeB3ohc": "calc_bitAnd",
    "va7iePei": "calc_sub",
    "vein1Enu": "calc_add",
    "iK3ain3J": "calc_shift_left",
    "dii5aePi": "calc_shift_right"
}

# Building the list of instructions from the crackme.nix file
f = open("crackme.nix", "r")
instructions = []
for index, line in enumerate(f):
    if index < 39:
        continue
    if "]" in line:
        break
    instructions.append(instruction_remap[line.strip()])

# Actually running the state machine
while mOBJECT["mCOUNT"] != -1:
        instr = globals().get(instructions[mOBJECT["mCOUNT"]])
        instr()
        input(f"About to run {instr.__name__}")
        print("----------------------")
        for key, val in mOBJECT.items():
            print(f"{key}: {val}")   
```

This is the first state when we launch the state machine:
```
mOBJECT = {
    "mCOUNT": 0,
    "mSTACK": [],
    "mSTATE": {},
    "mFLAG": [100, 97, 99, 104, 50, 48, 50, 53]
}
```
### Char Code to Large Numbers
Let's now go for a walk through the execution. We first notice a repeating section due to an early jump instruction. There are two outcomes at this instruction: either we decrement mCOUNT by 306 or increase it by 1. This is the state when the section finally completes, and we increase mCOUNT by 1:
```
mOBJECT = {
    "mCOUNT": 311,
    "mSTACK": [7],
    "mSTATE": {...'4': 1, '5': -306},
    "mFLAG": [...]
```
`mSTACK[0]` is counting the length of the user input character by character! 

*Note: The way the script chooses between the -306 and 1 is by shifting the current char code read from mFLAG 32 to the right. This either leads to 0, or it leads to -1. This is because -1 is returned by a right shift if a negative value is shifted. This obtained value is then incremented by 1. This either leads to a value of 0 (-1 + 1) or 1 (0 + 1). The constant 4 is then added to this value to receive either 4 or 5. The fourth and fifth keys of mSTATE are -306 and 1. Something similar is done for other jumps too.*

After we are finally out of the length count, we reach the pretty consistent part: 
4 of the mFLAG characters are pushed onto mSTATE:
```
mOBJECT = {
    "mCOUNT": 626,
    "mSTACK": [104, 99, 97, 100, 4, 13, -46816, 1],
    "mSTATE": {},
    "mFLAG": [100, 97, 99, 104, ...]
}
```
We also see new values for a potential jumps (-46816 instructions backward), so a lot is about to happen...
We hold enter and see some complex calculation turning the four input values into this number:
```
mOBJECT = {
    "mCOUNT": 751,
    "mSTACK": [1751343460, ...],
    "mSTATE": {...},
    "mFLAG": [...]
}
```
Four more characters are then loaded, and a second large number is produced:
```
mOBJECT = {
    "mCOUNT": 917,
    "mSTACK": [..., 2068206659, 1751343460, ...],
    "mSTATE": {},
    "mFLAG": [...]
}
```
So our eight characters were turned into 2 large numbers using some sort of complex calculation. 

Let's reverse this calculation to understand what happened. To do this, I took a piece of paper and noted each bit operation as well as the index it was performed on as I stepped through the instructions one by one:
```
[2] = FIRST_CHAR_CODE
[2] = [2] << 8
[2] = [2] xor SECOND_CHAR_CODE
[2] = [2] << 8
[2] = [2] xor THIRD_CHAR_CODE
[2] = [2] << 8
[2] = [2] xor FOURTH_CHAR_CODE
```
The first character is loaded and shifted 8 bits left, then xored with the next character, and so on. This is done twice for sets of 4 char codes, leaving us with these two values `2068206659, 1751343460`.

### Converting 2 Large Numbers to 2 Large Numbers (Modified XTEA)
Once 8 characters are converted, another large calculation commences. We step through and let it complete, leading to this result. 
```
mOBJECT = {
    "mCOUNT": 47263,
    "mSTACK": [..., 4265663887, 3326388521],
    "mSTATE": {...},
    "mFLAG": [...]
}
```

To reverse this calculation, we need to hope there are consistent repeating steps. Luckily, some complex calculation is completed 32 times with different inputs each time. This calculation takes 5 values, turns them into 2 new values, and repeats this process 32 times. 

Before each of these intermediate calculations, the state is as follows:
```
mOBJECT = {
    "mCOUNT": 6578,
    "mSTACK": [],
    "mSTATE": {..., '4': 4294967295, '5': 3946235075, '6': 750718763, '7': 4265663887, '8': 3326388521, ...},
    "mFLAG": [...]
}
```
Stopping execution at a few of these intermediate steps, we notice that `mSTATE["4"]` always remains `4294967295` (0xFFFFFFFF). 

We also see that `mSTATE["5"]` and `mSTATE["6"]` are constants that are uniquely calculated for each intermediate step, some sort of keys. This becomes clear once you try different flag inputs and notice that these values do not change. 

*Note: The constant values are produced through left shifts (<<) and additions (+1), to construct arbitrary values.*

When we step through, we reach the result of this intermediate step:
```
mOBJECT = {
    "mCOUNT": 32586,
    "mSTACK": [],
    "mSTATE": {..., '3': 4265663887, '4': 3326388521, ...},
    "mFLAG": [...]
}
```

The subsequent intermediate step has this state before it begins:
```
mOBJECT = {
    "mCOUNT": 6578,
    "mSTACK": [],
    "mSTATE": {..., '4': 4294967295, '5': 3946235075, '6': 750718763, '7': 4265663887, '8': 3326388521, ...},
    "mFLAG": [...]
}
```
Since `mSTATE["7"]` and `mSTATE["8"]` are the output from the previous round right above, we notice that this is a repeating process obfuscating the original input further and further through a [Feistel cipher](https://en.wikipedia.org/wiki/Feistel_cipher) like approach.

By skipping through, we extract the unique keys `mSTATE["5"]` and `mSTATE["6"]` and note them down for reversal later.
```
chain_params = [
    (2174560045, 4088821797),
    (4088821797, 1160655803),
    ...
    (4145865599, 2636477575),
    (1765160055, 3735928559)
]
```
Same as above, I carefully wrote down all bit operations of the intermediate steps to understand what is going on. The first output value is calculated using:
```
[1] = [8] << 4
[2] = [8] >> 5
[1] = [1] xor [2]
[1] = [1] + [8]
[1] = [1] bitand [5]
[6] = [6] xor [1]
[8] = [8] - [6]
[1] = [8] bitand [5]
```
The second value is calculated as follows, using the output from the first calculation. 
```
[1] = resultPrevious << 4
[2] = resultPrevious >> 5
[1] = [1] xor [2]
[1] = [1] + [8]
[1] = [1] bitand [5]
[6] = [6] xor [1]
[8] = [8] - [6]
[1] = [8] bitand [5]
```
After completing the challenge, I saw that this is similar to what [XTEA](https://en.wikipedia.org/wiki/XTEA) does!

After all this is completed, the -46816 jump is executed to repeat this process for the next 8 characters of the input, i.e,. bringing us back to section *Converting Input Flag to Char Code*

Since we only chose to use 8 characters for our example, though, the execution continues to the next phase.

### The Hidden Wanted Result
To briefly summarize where we are right now: Using the reimplemented state machine, we've turned sets of 8 char codes to sets of large numbers.

Next, a section calculates 12 seemingly random values and places them in mSTATE in addition to ALL the values we calculated:
```
mOBJECT = {
    "mCOUNT": 51677,
    "mSTACK": [],
    "mSTATE": {..., '5': 258714073, '6': 3466653107, '7': 3741326282, '8': 483122219, '9': 1313610194, '10': 3085818541, '11': 1813248470, '12': 486051852, '13': 3804786691, '14': 1421605445, '15': 1168692974, '16': 2186155117, '17': 1168692974, '18': 2186155117},
    "mFLAG": [...]
```
When you carefully look at these numbers, we see that the last two values of the new constants (`mSTATE["15"]` and `mSTATE["16"]`) are equal to our calculated values (`mSTATE["17"]` and `mSTATE["18"]`). Since these were calculated using `dach2025`, we see that the 12 values here are the values we want to obtain to receive the flag. Currently, we have only managed to match the final 2. We are getting closer!

Since there are 12 values and 8 characters are turned into 2 values, we know the final result will consist of `12 * (8 / 2) = 44` characters.
### Reversing the Calculations (flag)
All we need to do now is reverse the computation used to turn our input into the initial large numbers, as well as the subsequent 32 rounds of modified XTEA. This allows us to use the provided 12 values to go backwards and obtain the user input char code. 

We reverse the modified XTEA sub-operation from *Converting 2 Large Numbers to 2 Large Numbers (Modified XTEA)* by reversing each bit operation. We then run this 32 times with the chain parameters we've extracted. We then convert the output back into the character by reversing the operation initially completed on the four characters *Converting Input Flag to Char Code*. The full reverse then looks as follows:
```
chain_params = [
    (2174560045, 4088821797),
    (4088821797, 1160655803),
    (1764623005, 3946235075),
    (3946235075, 750718763),
    (146751561, 2061013313),
    (1787283088, 3427814615),
    (3701544840, 1918426591),
    (1377346048, 3017877575),
    (3558958118, 33204829),
    (904522349, 1400006131),
    (1400006131, 4185585403),
    (3314267883, 990069091),
    (990069091, 2300363641),
    (3171681161, 3667164943),
    (517245392, 2157776919),
    (1012729174, 3257227903),
    (2926990926, 272555157),
    (602792134, 1639356459),
    (2784404204, 129968435),
    (129968435, 1229419419),
    (625452217, 2539713969),
    (2539713969, 3906515271),
    (215515177, 2397127247),
    (1856046704, 3496578231),
    (4037658774, 511905485),
    (238175260, 1878706787),
    (2152437012, 369318763),
    (4123205516, 1468769747),
    (1468769747, 2779064297),
    (3650381817, 4145865599),
    (4145865599, 2636477575),
    (1765160055, 3735928559)
]

def value_to_string(val):
    # Extract bytes (lowest byte was originally the first character)
    b0 = val        & 0xFF
    b1 = (val >> 8) & 0xFF
    b2 = (val >> 16)& 0xFF
    b3 = (val >> 24)& 0xFF
    # reverse the order:
    return "".join([chr(b0), chr(b1), chr(b2), chr(b3)])

def invert_cluttered_expression(A, B, hash1, hash2):
    constant=0xFFFFFFFF
    temp_A = (((A * 16) ^ (A // 32)) + A) & constant
    key2 = (B + (hash2 ^ temp_A)) & constant
    temp_key2 = (((key2 * 16) ^ (key2 // 32)) + key2) & constant
    key1 = (A + (hash1 ^ temp_key2)) & constant
    return key1, key2

# reversed since we are going backwards. 32 elements in chain_params
def reverse_calculatedresult(final_A, final_B):
    A, B = final_A, final_B
    for hash1, hash2 in reversed(chain_params):
        A, B = invert_cluttered_expression(A, B, hash1, hash2)        
    return value_to_string(A), value_to_string(B)

# The values we want our user input to equal to
final_required = [
    (1168692974, 2186155117),
    (3804786691, 1421605445),
    (1813248470, 486051852),
    (1313610194, 3085818541),
    (3741326282, 483122219),
    (258714073,   3466653107)
]

for final_A, final_B in final_required:
    in1, in2 = reverse_calculatedresult(final_A, final_B)
    print(f"{in2}{in1}", end='')
```

We've found the flag!
```
dach2025{w3lc0m3_t0_my_funct10n4l_t34_p4rty_y4y}
```
### Mitigation
Solely obfuscation is usually not the best strategy for secure software. Especially when we are using simple lossless bit operations. To ensure we have a secure flag checker, since we are using sha256 anyway, the creator could hardcode a sha256 hash of the flag, alter the script to make it produce the sha256 hash of the user input by using the same nix sha256 function or implementing it through the machine instructions, and compare that to sha256 of the user input.