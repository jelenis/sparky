import clsx from "clsx"

export default function Card(
    {children, className, style}: {children: React.ReactNode, className?: string, style?: React.CSSProperties},
) {
    return (  
        <section style={style} className={clsx(
            className, "card p-6 pb-12 min-h-[300px]  bg-dark  border border-background  rounded-xl shadow-lg")} >
                {children}

        </section>
    )
}