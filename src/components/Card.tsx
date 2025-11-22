export default function Card({children}: {children: React.ReactNode}) {
    return (  
        <section className=" p-5 min-h-[300px]  bg-dark  border border-background p-4 w-full rounded-xl shadow-lg lg:max-w-[800px] md:max-w-[800px]">
            <div className="max-w-[500px]">
                {children}
            </div>
        </section>
    )
}