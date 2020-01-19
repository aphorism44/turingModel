These programs create a set of increasingly complex programming languages, all of which reduce to a standard Turing Machine (*tmModule.js*).

The "Wang" languages are taken from Stanford's CS103 class, *Mathematical Foundations of Computing*. The lecture slides are here: https://web.stanford.edu/class/archive/cs/cs103/cs103.1132/lectures/19/Slides19.pdf.

The purpose of the lecture was to demonstrate the Church-Turing Thesis. My personal motives for actually creating these languages was to see this thesis at work, and watch a normal programming language "compile" down to a Turing Machine.

I have only gone up to the "Wang-B2" language, which is 2 levels above a Turing Machine. This simplifies calculations. Moving to "Wang-B3" per the lecture would have involved a massive explosion of space and time complexity (to simulate variables, the lecture suggests making enough copies of the program to hardcode every possible permutation of the alphabet into each variable call).

I also used Charles Petzold's *The Annotated Turing* (http://theannotatedturing.com/).
