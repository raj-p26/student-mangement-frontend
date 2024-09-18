import { Badge } from "./Badge";

export function Input({
  label = "",
  type,
  name,
  value,
  onChange,
  onInput = null,
  min = null,
  max = null,
  placeholder,
  accept = null,
  required = false,
}) {
  return (
    <>
      <label className="col-auto text-center" htmlFor={name}>
        {required && <Badge />}
        {label}

      </label>
      <div className="col">
        {type !== "textarea" ? (
          <input
            type={type}
            id={name}
            name={name}
            value={value}
            className="form-control m-0"
            onChange={onChange}
            onInput={onInput}
            min={min}
            max={max}
            placeholder={placeholder}
            accept={accept}
          />
        ) : (
          <textarea
            id={name}
            name={name}
            value={value}
            className="form-control"
            onChange={onChange}
            placeholder={placeholder}
          />
        )}
      </div>
    </>
  );
}
