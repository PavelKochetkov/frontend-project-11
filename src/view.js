const renderForm = (state, elements, value) => {
  const { formState } = state;
  const { input, feedback, sendButton } = elements;
  if (value === 'processing') {
    input.setAttribute('disabled', '');
    sendButton.setAttribute('disabled', '');
    feedback.textContent = '';
    feedback.classList.remove('text-danger');
    input.classList.remove('is-invalid');
  }
  if (value === 'failed') {
    feedback.textContent = formState.error;
    feedback.classList.add('text-danger');
    input.classList.add('is-invalid');
    input.removeAttribute('disabled');
    sendButton.removeAttribute('disabled');
    input.focus();
  }
};

const renderLoading = (state, elements, value) => {
  const { statusLoading } = state;
  const { input, feedback, sendButton } = elements;
  if (value === 'succsess') {
    feedback.textContent = 'RSS загружен';
    feedback.classList.add('text-success');
    sendButton.removeAttribute('disabled');
    input.removeAttribute('disabled');
    input.value = '';
    input.focus();
  }
  if (value === 'failed') {
    feedback.textContent = statusLoading.error;
    console.log(statusLoading.error);
    feedback.classList.add('text-danger');
    input.classList.add('is-invalid');
    input.removeAttribute('disabled');
    sendButton.removeAttribute('disabled');
  }
};

export default (state, elements) => (path, value) => {
  if (path === 'formState.status') {
    renderForm(state, elements, value);
  }
  if (path === 'statusLoading.status') {
    renderLoading(state, elements, value);
  }
};
