import React from 'react';
import { FieldRenderProps } from 'react-final-form';
import { FormFieldProps, Form, Label } from 'semantic-ui-react';
import { DateTimePicker } from 'react-widgets';

interface IProps 
    extends FieldRenderProps<Date>, 
    FormFieldProps {};

const DateInput: React.FC<IProps> = ({
    input,
    width,
    placeholder,
    date = false,
    time = false,
    meta: { touched, error },
    id,
    ...rest
}) => {
    return (
        <Form.Field error={touched && !!error} width={width}>
            <DateTimePicker 
                id={id ? id.toString() : ''}
                placeholder={placeholder}
                value={input.value || null}
                onChange={input.onChange}
                date={date}
                time={time}
                {...rest}
            />
            {touched && error && (
                <Label basic color='red'>{error}</Label>
            )}
        </Form.Field>
    );
};

export default DateInput;