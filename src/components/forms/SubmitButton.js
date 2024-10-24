import React from "react";
import { useFormikContext } from "formik";

import AppButton from "../AppButton";

function SubmitButton({ title,width, bgcolor, textcol }) {
  const { handleSubmit } = useFormikContext();
  return <AppButton title={title} width={width} bgcolor={bgcolor} onPress={handleSubmit} textcol = {textcol}/>;
}

export default SubmitButton;
