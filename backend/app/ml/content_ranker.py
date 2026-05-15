CONTENT_DB = {
    "variables": [
        ("Python Variables — W3Schools", "https://www.w3schools.com/python/python_variables.asp", "article"),
        ("Variables in Programming — Khan Academy", "https://www.khanacademy.org/computing/computer-programming/programming#variables", "video"),
    ],
    "conditionals": [
        ("Python If…Else — W3Schools", "https://www.w3schools.com/python/python_conditions.asp", "article"),
        ("Conditionals — CS50", "https://cs50.harvard.edu/x/2023/notes/1/#conditionals", "video"),
    ],
    "loops": [
        ("Python For Loops — W3Schools", "https://www.w3schools.com/python/python_for_loops.asp", "article"),
        ("Loops — Codecademy", "https://www.codecademy.com/learn/learn-python-3/modules/learn-python3-loops", "interactive"),
    ],
    "functions": [
        ("Python Functions — W3Schools", "https://www.w3schools.com/python/python_functions.asp", "article"),
        ("Functions — Real Python", "https://realpython.com/defining-your-own-python-function/", "article"),
    ],
    "arrays": [
        ("Python Lists — W3Schools", "https://www.w3schools.com/python/python_lists.asp", "article"),
        ("Array Data Structure — GeeksForGeeks", "https://www.geeksforgeeks.org/array-data-structure/", "article"),
    ],
    "recursion": [
        ("Recursion — CS50", "https://cs50.harvard.edu/x/2023/notes/3/#recursion", "video"),
        ("Recursion — GeeksForGeeks", "https://www.geeksforgeeks.org/recursion/", "article"),
    ],
    "time_complexity": [
        ("Big O Notation — freeCodeCamp", "https://www.freecodecamp.org/news/big-o-notation-explained/", "article"),
        ("Time Complexity — Khan Academy", "https://www.khanacademy.org/computing/computer-science/algorithms#asymptotic-notation", "video"),
    ],
    "sorting": [
        ("Sorting Algorithms — VisuAlgo", "https://visualgo.net/en/sorting", "interactive"),
        ("Sorting Algorithms — GeeksForGeeks", "https://www.geeksforgeeks.org/sorting-algorithms/", "article"),
    ],
    "searching": [
        ("Binary Search — Khan Academy", "https://www.khanacademy.org/computing/computer-science/algorithms#binary-search", "video"),
        ("Searching Algorithms — GeeksForGeeks", "https://www.geeksforgeeks.org/searching-algorithms/", "article"),
    ],
    "oop_classes": [
        ("Python OOP — Real Python", "https://realpython.com/python3-object-oriented-programming/", "article"),
        ("OOP Concepts — Programiz", "https://www.programiz.com/python-programming/object-oriented-programming", "article"),
    ],
    "linked_lists": [
        ("Linked Lists — GeeksForGeeks", "https://www.geeksforgeeks.org/data-structures/linked-list/", "article"),
        ("Linked Lists — CS50", "https://cs50.harvard.edu/x/2023/notes/5/#linked-lists", "video"),
    ],
    "trees": [
        ("Tree Data Structure — freeCodeCamp", "https://www.freecodecamp.org/news/all-you-need-to-know-about-tree-data-structures/", "article"),
        ("Binary Trees — GeeksForGeeks", "https://www.geeksforgeeks.org/binary-tree-data-structure/", "article"),
    ],
    "graphs": [
        ("Graph Algorithms — freeCodeCamp", "https://www.freecodecamp.org/news/graph-algorithms-explained/", "article"),
        ("Graph Data Structure — Programiz", "https://www.programiz.com/dsa/graph", "article"),
    ],
    "dynamic_programming": [
        ("DP — freeCodeCamp", "https://www.freecodecamp.org/news/dynamic-programming-for-beginners/", "article"),
        ("DP Patterns — Educative", "https://www.educative.io/blog/dynamic-programming-patterns", "article"),
    ],
    "hash_tables": [
        ("Hash Tables — CS50", "https://cs50.harvard.edu/x/2023/notes/5/#hash-tables", "video"),
        ("Hash Tables — GeeksForGeeks", "https://www.geeksforgeeks.org/hashing-data-structure/", "article"),
    ],
    "math_fundamentals": [
        ("Khan Academy Math", "https://www.khanacademy.org/math", "video"),
        ("Brilliant Math Fundamentals", "https://brilliant.org/courses/logic-deduction/", "interactive"),
    ],
    "pointers": [
        ("Pointers in C — CS50", "https://cs50.harvard.edu/x/2023/notes/4/#pointers", "video"),
        ("Pointers — GeeksForGeeks", "https://www.geeksforgeeks.org/pointers-in-c-cpp/", "article"),
    ],
    "data_types": [
        ("Python Data Types — W3Schools", "https://www.w3schools.com/python/python_datatypes.asp", "article"),
        ("Data Types — Real Python", "https://realpython.com/python-data-types/", "article"),
    ],
    "strings": [
        ("Python Strings — W3Schools", "https://www.w3schools.com/python/python_strings.asp", "article"),
        ("String Manipulation — Real Python", "https://realpython.com/python-strings/", "article"),
    ],
    "stacks_queues": [
        ("Stack & Queue — GeeksForGeeks", "https://www.geeksforgeeks.org/stack-data-structure/", "article"),
        ("Stacks — CS50", "https://cs50.harvard.edu/x/2023/notes/5/#stacks", "video"),
    ],
    "greedy": [
        ("Greedy Algorithms — freeCodeCamp", "https://www.freecodecamp.org/news/greedy-algorithms-explained/", "article"),
        ("Greedy — GeeksForGeeks", "https://www.geeksforgeeks.org/greedy-algorithms/", "article"),
    ],
    "space_complexity": [
        ("Space Complexity — GeeksForGeeks", "https://www.geeksforgeeks.org/g-fact-86/", "article"),
    ],
    "bit_manipulation": [
        ("Bit Manipulation — GeeksForGeeks", "https://www.geeksforgeeks.org/bitwise-algorithms/", "article"),
    ],
    "oop_inheritance": [
        ("Inheritance in Python — Real Python", "https://realpython.com/inheritance-python/", "article"),
    ],
    "probability": [
        ("Probability — Khan Academy", "https://www.khanacademy.org/math/statistics-probability/probability-library", "video"),
    ],
}


def rank_content(skill: str, top_n: int = 2) -> list[dict]:
    sources = CONTENT_DB.get(skill, [])
    return [
        {"title": title, "url": url, "type": fmt}
        for title, url, fmt in sources[:top_n]
    ]
