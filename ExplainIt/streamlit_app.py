import streamlit as st

st.set_page_config(
    page_title="ExplainIt",
    page_icon="🎤",
    layout="wide"
)

st.title("🎤 ExplainIt")

st.write(
    "Don't just memorize. Understand it."
)

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
    st.success(
        f"Presentation uploaded: {presentation.name}"
    )

if rubric:
    st.success(
        f"Rubric uploaded: {rubric.name}"
    )

if presentation and rubric:

    st.divider()

    st.success(
        "Your files are ready! 🎉"
    )

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

            st.success(
                "Good start! Your explanation has enough detail."
            )