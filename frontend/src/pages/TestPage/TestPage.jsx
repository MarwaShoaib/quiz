import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';

function TestPage({ onNext }) {
  const { register, handleSubmit } = useForm();

  const onSubmit = (data) => {
    onNext(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label htmlFor="inputField">Input Field:</label>
      <input type="text" id="inputField" {...register('inputField')} />

      <button type="submit">Next</button>
    </form>
  );
}

export default TestPage;