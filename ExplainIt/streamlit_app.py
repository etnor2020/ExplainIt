import streamlit as st
import requests
from pypdf import PdfReader


st.set_page_config(
    page_title="ExplainIt",
    page_icon="🎤",
    layout="wide"
)


def read_pdf(uploaded_file):
    reader = PdfReader(uploaded_file)
    text = ""

    for page in reader.pages:
        text += page.extract_text() or ""

    return text[:12000]


def ask_gemini(prompt):
    response = requests.post(
        "https://generativelanguage.googleapis.com/v1beta/"
        "models/gemini-3.6-flash:generateContent",
        params={"key": st.secrets["GEMINI_API_KEY"]},
        json={
            "contents": [
                {
                    "parts": [
                        {"text": prompt}
                    ]
                }
            ]
        },
        timeout=60
    )

    response.raise_for_status()

    return response.json()["candidates"][0]["content"]["parts"][0]["text"]


def create_practice_questions(presentation_text, rubric_text):
    prompt = f"""
You are ExplainIt, a supportive study coach.

Using the presentation and rubric below, create exactly 5 practice
questions that help a student prepare to explain their presentation.

Make the questions clear, specific, and appropriate for a student.
Include a mix of main-idea, evidence, and reflection questions.

PRESENTATION:
{presentation_text}

RUBRIC:
{rubric_text}
"""

    return ask_gemini(prompt)


def evaluate_explanation(presentation_text, rubric_text, answer):
    prompt = f"""
You are ExplainIt, a supportive study coach.

Evaluate the student's explanation using the presentation and rubric below.

Give feedback in these three short sections:
1. What they explained well
2. What they should improve
3. One stronger example answer

Be encouraging and specific. Do not give a grade.

PRESENTATION:
{presentation_text}

RUBRIC:
{rubric_text}

STUDENT EXPLANATION:
{answer}
"""

    return ask_gemini(prompt)


st.title("🎤 ExplainIt")

st.write("Don't just memorize. Understand it.")

st.subheader("Prepare your presentation")

presentation = st.file_uploader(
    "Upload your presentation",
    type=["pdf"]
)

rubric = st.file_uploader(
    "Upload your rubric",
    type=["pdf"]
)

if presentation:
    st.success(f"Presentation uploaded: {presentation.name}")

if rubric:
    st.success(f"Rubric uploaded: {rubric.name}")

if presentation and rubric:
    st.divider()

    st.success("Your files are ready! 🎉")

    if st.button("Create My 5 Practice Questions"):
        try:
            with st.spinner("ExplainIt is creating your questions..."):
                presentation_text = read_pdf(presentation)
                rubric_text = read_pdf(rubric)

                if not presentation_text:
                    st.error("I could not read text from that presentation PDF.")
                else:
                    st.session_state.questions = create_practice_questions(
                        presentation_text,
                        rubric_text
                    )
        except Exception as error:
            st.error(f"Something went wrong: {error}")

    if "questions" in st.session_state:
        st.subheader("Your Practice Questions")
        st.write(st.session_state.questions)

    st.divider()

    st.header("Explain It Back")

    answer = st.text_area(
        "Explain the main idea of your presentation:"
    )

    if st.button("Check My Explanation →"):
        if len(answer.split()) < 8:
            st.warning(
                "Your explanation is too short. "
                "Try writing at least one complete sentence."
            )
        else:
            try:
                with st.spinner("ExplainIt is reviewing your explanation..."):
                    feedback = evaluate_explanation(
                        read_pdf(presentation),
                        read_pdf(rubric),
                        answer
                    )

                st.subheader("Your AI Feedback")
                st.write(feedback)

            except Exception as error:
                st.error(f"Something went wrong: {error}")