import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
// import TestPage from './TestPage';
// import TestPage2 from './TestPage2';
function TestPage({ onSubmit1 }) {
    const { register, handleSubmit } = useForm();

    const onSubmit = (data) => {
        onSubmit1(data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <label htmlFor="name">name:</label>
            <input type="text" id="name" {...register('name')} />

            <button type="submit">submit1</button>
        </form>
    );
}
function TestPage2({  onSubmit2 }) {
    const { control, register, handleSubmit, formState: { errors } } = useForm();
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'phone-numbers',
    });

    const handleAddField = () => {
        append({ phone_number: '' });
    };

    const handleRemoveField = (index) => {
        remove(index);
    };

    const handleFormSubmit = (data) => {
        onSubmit2(data);
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)}>
            {fields.map((field, index) => (
                <div key={field.id}>
                    <label htmlFor={`inputArray[${index}].inputArrayField`}>phone number {index + 1}:</label>
                    <input
                        type="text"
                        id={`inputArray[${index}].inputArrayField`}
                        {...register(`phone-numbers[${index}].phone_number`, { required: true })}
                    />

                    <button type="button" onClick={() => handleRemoveField(index)}>Remove</button>
                </div>
            ))}

            <button type="button" onClick={handleAddField}>Add Field</button>

            <button type="submit">Submit2</button>
        </form>
    );
}
function TestPage3() {
    const [formData, setFormData] = React.useState(null);

    const handleFirstPageSubmit = (data) => {
        setFormData(data);
    };

    const handleSecondPageSubmit = (data) => {
        setFormData({ ...formData, ...data });
        console.log('Form data:', { ...formData });
        console.log('Form data:', { ...data });
        console.log('Form data:', { ...formData, ...data });
    };

    return (
        <div>
            
            {!formData && <TestPage onSubmit1={handleFirstPageSubmit} />}
            {formData && <TestPage2 onSubmit2={handleSecondPageSubmit} />}
        </div>
    );
}

export default TestPage3;