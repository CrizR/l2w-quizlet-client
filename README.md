## L2W Assignment

### Architecture

![architecture png](architecture.png)

### Spaced Repetition Algorithm Implementation

Conceptually there are n boxes containing k flashcards (where a flashcard is your typical question with answers).

Each question/flashcard starts in the first box. For each correct answer, the question is moved into the next box (promote).
For each wrong answer the question is moved backwards (demote). If a question gets to the last box, it is finished.
 
This happens for each session where a session contains all of the current cards the user has not finished.
Each session is represented by a Heap where the questions with the lowest box values are at the top. (0,0,1,2,3)

As questions are encountered and answered they are added to the next session but only if they haven't
reached the last box.

Once the current session is empty, we then add all questions from the next session to the current session
and continue the quiz.

Lastly, if a user decides to skip a card the card is put into the next session.

### Edge Case Improvements:

1. Handling of small quizzes.
For a quiz with a single question, the user has to answer the same question multiple times. Would be best to have a minimum number of questions per quiz.

2. If there is only one question left and it has not reached the last box, the user will see the question multiple times in a row before the quiz is finished. Would be best to randomize the order of answers for consecutive identical questions.
