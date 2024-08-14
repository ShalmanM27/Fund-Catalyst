import React,{ChangeEvent} from 'react'

interface Props {
    LabelName ?: string;
    isTextArea ?: boolean;
    placeholder ?: string;
    inputtype ?: React.HTMLInputTypeAttribute;
    value ?: string | number ;
    handleChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const FormField : React.FC<Props> = ({LabelName,isTextArea, placeholder, inputtype, value, handleChange}) => {
  return (
    <label className='flex-1 w-full flex flex-col'>
      {LabelName && <span className='font-epilogue font-medium text-[14px] leading-[22px] text-[#808191] mb-[10px]'>{LabelName}</span>}
      {isTextArea ?
       (<textarea 
        required
        value={value}
        rows={10}
        onChange={handleChange}
        placeholder={placeholder} 
        className='py-[15px] sm:px-[25px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-transparent font-epilogue text-white text-[14px] placeholder:text-[#4b5264] rounded-[10px] sm:min-w-[300px]'
        />) :
       (<input 
        required
        value={value}
        onChange={handleChange}
        type= {inputtype}
        placeholder={placeholder} 
        step="0.1"
        className='py-[15px] sm:px-[25px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-transparent font-epilogue text-white text-[14px] placeholder:text-[#4b5264] rounded-[10px] sm:min-w-[300px]'
        />)}
    </label>
  )
}

export default FormField;