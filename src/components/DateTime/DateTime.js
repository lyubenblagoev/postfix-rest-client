function DateTime({ date }) {
    const dt = new Date(date);
    return (
        <>
            {new Date(dt).toLocaleDateString()} {new Date(dt).toLocaleTimeString()}
        </>
    )
}

export default DateTime;