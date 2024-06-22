import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';

function TestPage2({ onPrevious, onSubmit }) {
    const { control,register, handleSubmit, formState: { errors } } = useForm();
    const { fields, append, remove } = useFieldArray({
      control,
      name: 'inputArray',
    });
  
    const handleAddField = () => {
      append({ inputArrayField: '' });
    };
  
    const handleRemoveField = (index) => {
      remove(index);
    };
  
    const handleFormSubmit = (data) => {
      onSubmit(data);
    };
  
    return (
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        {fields.map((field, index) => (
          <div key={field.id}>
            <label htmlFor={`inputArray[${index}].inputArrayField`}>Input Field {index + 1}:</label>
            <input
              type="text"
              id={`inputArray[${index}].inputArrayField`}
              {...register(`inputArray[${index}].inputArrayField`, { required: true })}
            />
  
            <button type="button" onClick={() => handleRemoveField(index)}>Remove</button>
          </div>
        ))}
  
        <button type="button" onClick={handleAddField}>Add Field</button>
  
        <button type="submit">Submit</button>
      </form>
    );
  }
  
export default TestPage2;