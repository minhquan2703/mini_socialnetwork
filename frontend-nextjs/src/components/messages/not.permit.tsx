const NotPermitPage = () => {
    return (
        <div
            style={{
                height: "100%",
                width: "100%",
                textAlign: "center",
                padding: "20px",
                color: "#333",
                fontFamily: "sans-serif",
            }}
        >
            <h2
                style={{
                    fontSize: "24px",
                    fontWeight: "600",
                    marginBottom: "8px",
                }}
            >
                Bạn không được phép truy cập
            </h2>
            <p style={{ fontSize: "16px", color: "#666" }}>
                Vui lòng chọn cuộc hội thoại khác.
            </p>
        </div>
    );
};
export default NotPermitPage;
