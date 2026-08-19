const startButton =
    document.getElementById("startButton");

const uploadSection =
    document.getElementById("uploadSection");

const presentationFile =
    document.getElementById("presentationFile");

const rubricFile =
    document.getElementById("rubricFile");

const presentationName =
    document.getElementById("presentationName");

const rubricName =
    document.getElementById("rubricName");

const prepareButton =
    document.getElementById("prepareButton");

const nextSection =
    document.getElementById("nextSection");

const fileSummary =
    document.getElementById("fileSummary");

const presentationText =
    document.getElementById("presentationText");

const rubricText =
    document.getElementById("rubricText");


// ===============================
// START BUTTON
// ===============================

startButton.addEventListener("click", function () {

    uploadSection.scrollIntoView({
        behavior: "smooth"
    });

});


// ===============================
// PRESENTATION FILE
// ===============================

presentationFile.addEventListener("change", function () {

    if (presentationFile.files.length > 0) {

        presentationName.textContent =
            "Selected: " +
            presentationFile.files[0].name;

    }

});


// ===============================
// RUBRIC FILE
// ===============================

rubricFile.addEventListener("change", function () {

    if (rubricFile.files.length > 0) {

        rubricName.textContent =
            "Selected: " +
            rubricFile.files[0].name;

    }

});


// ===============================
// PDF READER
// ===============================

async function readPDF(file) {

    const arrayBuffer =
        await file.arrayBuffer();

    const pdf =
        await pdfjsLib.getDocument({
            data: arrayBuffer
        }).promise;

    let text = "";


    for (
        let pageNumber = 1;
        pageNumber <= pdf.numPages;
        pageNumber++
    ) {

        const page =
            await pdf.getPage(pageNumber);

        const content =
            await page.getTextContent();

        const pageText =
            content.items
                .map(function (item) {
                    return item.str;
                })
                .join(" ");

        text +=
            "\n\n--- PAGE " +
            pageNumber +
            " ---\n\n" +
            pageText;

    }


    return text;

}


// ===============================
// CONTINUE BUTTON
// ===============================

prepareButton.addEventListener(
    "click",
    async function () {

        const presentation =
            presentationFile.files[0];

        const rubric =
            rubricFile.files[0];


        if (!presentation) {

            alert(
                "Please upload your presentation first."
            );

            return;

        }


        if (!rubric) {

            alert(
                "Please upload your rubric first."
            );

            return;

        }


        prepareButton.textContent =
            "Reading your files...";

        prepareButton.disabled = true;


        try {

            const presentationContent =
                await readPDF(presentation);


            const rubricContent =
                await readPDF(rubric);


            fileSummary.textContent =
                "We successfully read both files! 🎉";


            presentationText.textContent =
                presentationContent;


            rubricText.textContent =
                rubricContent;


            createKeyPoints(
                presentationContent
            );


            createRubricChecklist(
                rubricContent
            );


            // Create practice questions

            createPracticeQuestions(
                presentationContent
            );


            nextSection.style.display =
                "block";


            nextSection.scrollIntoView({
                behavior: "smooth"
            });


        } catch (error) {

            console.error(error);

            alert(
                "There was a problem reading your files. Make sure both files are PDFs."
            );

        }


        prepareButton.textContent =
            "Continue →";

        prepareButton.disabled = false;

    }
);


// ===============================
// KEY POINTS
// ===============================

function createKeyPoints(text) {

    const keyPoints =
        document.getElementById("keyPoints");


    keyPoints.innerHTML = "";


    const pages =
        text.split("--- PAGE");


    let pointNumber = 1;


    pages.forEach(function(page) {

        const cleanPage =
            page.trim();


        if (cleanPage.length < 20) {
            return;
        }


        const lines =
            cleanPage
                .split("\n")
                .map(function(line) {
                    return line.trim();
                })
                .filter(function(line) {
                    return line.length > 0;
                });


        if (lines.length === 0) {
            return;
        }


        const title =
            lines[0];


        const explanation =
            lines
                .slice(1, 4)
                .join(" ");


        const point =
            document.createElement("div");


        point.className =
            "key-point";


        point.innerHTML = `

            <span class="number">
                ${pointNumber}
            </span>

            <div>

                <h3>
                    ${title}
                </h3>

                <p>
                    ${explanation}
                </p>

            </div>

        `;


        keyPoints.appendChild(point);


        pointNumber++;

    });

}


// ===============================
// RUBRIC CHECKLIST
// ===============================

function createRubricChecklist(text) {

    const checklist =
        document.getElementById(
            "rubricChecklist"
        );


    checklist.innerHTML = "";


    const lines =
        text
            .split("\n")
            .map(function(line) {
                return line.trim();
            })
            .filter(function(line) {
                return line.length > 10;
            });


    const importantLines =
        lines.slice(0, 10);


    if (importantLines.length === 0) {

        checklist.innerHTML = `

            <div class="rubric-item">

                <span>
                    We couldn't find clear rubric
                    requirements in this PDF.
                </span>

            </div>

        `;

        return;

    }


    importantLines.forEach(function(line) {

        const item =
            document.createElement("div");


        item.className =
            "rubric-item";


        item.innerHTML = `

            <input type="checkbox">

            <span>
                ${line}
            </span>

        `;


        checklist.appendChild(item);

    });

}


// ===============================
// EXPLAIN IT BACK
// ===============================

const practiceButton =
    document.getElementById(
        "practiceButton"
    );

const practiceArea =
    document.getElementById(
        "practiceArea"
    );

const checkAnswerButton =
    document.getElementById(
        "checkAnswerButton"
    );

const practiceAnswer =
    document.getElementById(
        "practiceAnswer"
    );

const practiceFeedback =
    document.getElementById(
        "practiceFeedback"
    );


practiceButton.addEventListener(
    "click",
    function () {

        practiceArea.style.display =
            "block";

        practiceArea.scrollIntoView({
            behavior: "smooth"
        });

    }
);


// ===============================
// CHECK EXPLANATION
// ===============================

checkAnswerButton.addEventListener(
    "click",
    function () {

        const answer =
            practiceAnswer.value.trim();


        if (answer.length === 0) {

            alert(
                "Write your explanation first!"
            );

            return;

        }


        const answerWords =
            answer
                .toLowerCase()
                .split(/\s+/)
                .filter(function(word) {
                    return word.length > 0;
                });


        const wordCount =
            answerWords.length;


        if (wordCount < 8) {

            practiceFeedback.style.display =
                "block";


            practiceFeedback.innerHTML = `

                <h3>
                    🔴 Your explanation is too short
                </h3>

                <p>
                    You used
                    <strong>${wordCount} words</strong>.
                    Try explaining the idea in at least
                    one complete sentence.
                </p>

                <p>
                    Explain
                    <strong>
                        what it is, why it matters,
                        or how it works.
                    </strong>
                </p>

            `;

            return;

        }


        const presentation =
            presentationText.textContent;


        const presentationLower =
            presentation.toLowerCase();


        const matchedWords =
            answerWords.filter(function(word) {

                return (
                    word.length > 3 &&
                    presentationLower.includes(word)
                );

            });


        const uniqueMatches =
            [...new Set(matchedWords)];


        const meaningfulWords =
            answerWords.filter(function(word) {

                return word.length > 3;

            });


        const coverage =
            meaningfulWords.length > 0
                ? Math.round(
                    (
                        uniqueMatches.length /
                        new Set(
                            meaningfulWords
                        ).size
                    ) * 100
                )
                : 0;


        practiceFeedback.style.display =
            "block";


        if (coverage >= 50) {

            practiceFeedback.innerHTML = `

                <h3>
                    🟢 Good understanding!
                </h3>

                <p>
                    Your explanation is long enough
                    and connects with important ideas
                    from your presentation.
                </p>

                <p>
                    <strong>
                        Ideas you mentioned:
                    </strong>

                    ${uniqueMatches
                        .slice(0, 8)
                        .join(", ")}
                </p>

                <p>
                    Now try explaining it again
                    without looking at your slides.
                </p>

            `;

        } else {

            practiceFeedback.innerHTML = `

                <h3>
                    🟡 Keep practicing!
                </h3>

                <p>
                    Your explanation is long enough,
                    but it doesn't connect strongly
                    enough with the information in
                    your presentation.
                </p>

                <p>
                    Review your main ideas, evidence,
                    and conclusion.
                </p>

            `;

        }

    }
);


// ===============================
// PRACTICE QUESTIONS
// ===============================

const questionsArea =
    document.getElementById("questionsArea");

const questionNumber =
    document.getElementById("questionNumber");

const totalQuestions =
    document.getElementById("totalQuestions");

const progressPercent =
    document.getElementById("progressPercent");

const progressFill =
    document.getElementById("progressFill");

const questionText =
    document.getElementById("questionText");

const questionAnswer =
    document.getElementById("questionAnswer");

const submitQuestionButton =
    document.getElementById("submitQuestionButton");

const questionFeedback =
    document.getElementById("questionFeedback");

const nextQuestionButton =
    document.getElementById("nextQuestionButton");


// ALWAYS HAVE 5 QUESTIONS

let practiceQuestions = [];

let currentQuestion = 0;

const TOTAL_QUESTIONS = 5;


// ===============================
// CREATE 5 QUESTIONS
// ===============================

function createPracticeQuestions(text) {

    practiceQuestions = [

        {
            question:
                "What is the main idea of your presentation?"
        },

        {
            question:
                "What is one important concept you learned from your presentation?"
        },

        {
            question:
                "What evidence, example, or information supports your main idea?"
        },

        {
            question:
                "Why is the information in your presentation important?"
        },

        {
            question:
                "How do the main ideas in your presentation connect to each other?"
        }

    ];


    currentQuestion = 0;


    totalQuestions.textContent =
        TOTAL_QUESTIONS;


    showQuestion();

}


// ===============================
// SHOW QUESTION
// ===============================

function showQuestion() {

    const question =
        practiceQuestions[currentQuestion];


    if (!question) {
        return;
    }


    // Example:
    // Question 1 of 5

    questionNumber.textContent =
        currentQuestion + 1;


    totalQuestions.textContent =
        TOTAL_QUESTIONS;


    // Calculate progress

    const progress =
        Math.round(
            (
                (currentQuestion + 1) /
                TOTAL_QUESTIONS
            ) * 100
        );


    // Update percentage

    progressPercent.textContent =
        progress + "%";


    // Move progress bar

    progressFill.style.width =
        progress + "%";


    // Show question

    questionText.textContent =
        question.question;


    // Clear previous answer

    questionAnswer.value = "";


    // Clear feedback

    questionFeedback.innerHTML = "";

    questionFeedback.style.display =
        "none";


    // Hide next button

    nextQuestionButton.style.display =
        "none";


    // Make sure answer area is visible

    questionAnswer.style.display =
        "block";


    submitQuestionButton.style.display =
        "inline-block";

}


// ===============================
// CHECK ANSWER
// ===============================

submitQuestionButton.addEventListener(
    "click",
    function () {

        const answer =
            questionAnswer.value.trim();


        if (answer.length === 0) {

            alert(
                "Write your answer first!"
            );

            return;

        }


        // Count words

        const words =
            answer
                .split(/\s+/)
                .filter(function(word) {

                    return word.length > 0;

                });


        const wordCount =
            words.length;


        // Require a complete answer

        if (wordCount < 8) {

            questionFeedback.style.display =
                "block";


            questionFeedback.innerHTML = `

                <h3>
                    🔴 Your answer is too short
                </h3>

                <p>
                    You used
                    <strong>${wordCount} words</strong>.
                </p>

                <p>
                    Try explaining your answer
                    using at least one complete
                    sentence.
                </p>

            `;

            return;

        }


        // Get presentation

        const presentation =
            presentationText.textContent
                .toLowerCase();


        // Find words from the answer
        // that appear in the presentation

        const answerWords =
            answer
                .toLowerCase()
                .split(/\s+/);


        const matches =
            answerWords.filter(function(word) {

                return (
                    word.length > 3 &&
                    presentation.includes(word)
                );

            });


        const uniqueMatches =
            [...new Set(matches)];


        // Show feedback

        questionFeedback.style.display =
            "block";


        if (uniqueMatches.length >= 3) {

            questionFeedback.innerHTML = `

                <h3>
                    🟢 Strong answer!
                </h3>

                <p>
                    Your answer is detailed and
                    connects with information from
                    your presentation.
                </p>

                <p>
                    Keep practicing so you can
                    explain the idea naturally
                    without reading your slides.
                </p>

            `;

        } else {

            questionFeedback.innerHTML = `

                <h3>
                    🟡 Keep practicing!
                </h3>

                <p>
                    Your answer has enough detail,
                    but try connecting it more
                    closely to your presentation.
                </p>

                <p>
                    Think about the main ideas,
                    evidence, and examples from
                    your slides.
                </p>

            `;

        }


        // Show next button

        nextQuestionButton.style.display =
            "inline-block";

    }
);


// ===============================
// NEXT QUESTION
// ===============================

nextQuestionButton.addEventListener(
    "click",
    function () {

        currentQuestion++;


        // If all 5 are finished

        if (
            currentQuestion >=
            TOTAL_QUESTIONS
        ) {

            questionNumber.textContent =
                "5";


            totalQuestions.textContent =
                "5";


            progressPercent.textContent =
                "100%";


            progressFill.style.width =
                "100%";


            questionText.textContent =
                "🎉 You finished all 5 questions!";


            questionAnswer.style.display =
                "none";


            submitQuestionButton.style.display =
                "none";


            nextQuestionButton.style.display =
                "none";


            questionFeedback.style.display =
                "block";


            questionFeedback.innerHTML = `

                <h3>
                    Great job! 🎉
                </h3>

                <p>
                    You completed all 5 practice
                    questions.
                </p>

                <p>
                    Now try presenting your
                    material without looking
                    at your slides.
                </p>

            `;

            return;

        }


        showQuestion();

    }
);