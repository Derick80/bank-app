export interface SliderProps {
  name: string
  value: number
  defaultValue?: number
  children?: React.ReactNode
  disabled?: boolean
  onClick?: () => any
  onChange?: (...args: any) => any
  className?: string
  id?: string
}

export default function Slider({
  name,
  value,
  defaultValue,
  disabled,
  className,
  id,
  onChange,
  onClick,
  children
}: SliderProps) {
  return (
    <div className='flex flex-col'>
      <input
        type='range'
        name={name}
        value={value}
        defaultValue={defaultValue}
        disabled={disabled}
        className={className}
        id={id}
        onClick={onClick}
        onChange={onChange}
        list='tickmarks'
        min={0}
        max={1}
        step={0.5}
      />
      <datalist id='tickmarks' className='flex justify-between'>
        <option value={0} label='False'></option>
        <option value={0.5} label='-'></option>
        <option value={1} label='True'></option>
      </datalist>
    </div>
  )
}
