const About = () => {
    const containerStyle = {
        background: "linear-gradient(90deg, #1f4037, #99f2c8)",
        color: "#ffffff",
        padding: "2rem",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        lineHeight: "1.8",
    };

    const headingStyle = {
        fontSize: "2rem",
        fontWeight: "bold",
        marginBottom: "1rem"
    };

    const highlightStyle = {
        color: "#fffd90"
    };

    return (
        <div style={containerStyle} className="h-screen w-full flex flex-col items-center justify-center"> 
            <h1 style={headingStyle}>Welcome to <span style={highlightStyle}>GreenBasket Sikkim</span>!</h1>
            <p>
                Your trusted online destination for farm-fresh, 100% organic vegetables delivered straight to your doorstep!
            </p>
            <p>
                Grown with love in the heart of Sikkim’s pristine hills, our produce is chemical-free, handpicked, and packed with nutrition.
            </p>
            <p>
                We connect you directly with local farmers, ensuring freshness, fair prices, and sustainability in every order.
            </p>
            <p>
                Whether you’re in Gangtok, Namchi, or a quiet village in between, we bring the market to you – fresh, fast, and fuss-free.
            </p>
            <p style={{ fontWeight: "600", color: "#eaffd0" }}>
                Say goodbye to pesticides and hello to healthy living with GreenBasket – Sikkim’s greenest choice!
            </p>
        </div>
    );
};

export default About;
