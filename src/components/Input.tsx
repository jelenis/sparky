interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    heading?: string;
    hint?: string;
    className?: string;
};

export default function Input(
    { className, heading, label, children, hint="", ...props }: InputProps) {
        
    return (
        <div>
            {heading && <h4 className="pb-2">{heading}</h4>}
            <fieldset className="fieldset">
                <label className="number input mb-1 font-medium w-full p-2 border rounded max-w-[25em]" >
                    <input pattern="[0-9]*" min={1} minLength={1} className="validator w-full" autoComplete="off" {...props} />
                    <span className="label">{label}</span>
                </label>
                    <p className="validator-hint">{hint}</p>
            </fieldset>
        </div>
);
}