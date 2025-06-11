import { Card, Skeleton } from "antd";

const SkeletonCard = () => (
    <Card
        style={{
            marginBottom: "16px",
            borderRadius: "12px",
            border: "1px solidrgb(183, 183, 183)",
            boxShadow: "none",
            height: "220px",
        }}
    >
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <Skeleton.Avatar active size={42} shape="circle" />
            <div style={{ flex: 1 }}>
                <Skeleton active paragraph={{ rows: 1 }} title={false} />
            </div>
        </div>
        <div style={{ margin: "16px 0" }}>
            <Skeleton active paragraph={{ rows: 2 }} title={false} />
        </div>
        {/* <Skeleton.Image style={{ width: "100%", height: "100%", borderRadius: 8 }} active /> */}
        <div style={{ marginTop: "16px" }}>
            <Skeleton.Button style={{ marginRight: 8 }} active size="small" />
            <Skeleton.Button style={{ marginRight: 8 }} active size="small" />
            <Skeleton.Button active size="small" />
        </div>
    </Card>
);

export default SkeletonCard;
