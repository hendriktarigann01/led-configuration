import { BasePage } from "./BasePage";

export const FirstPage = ({ data }) => {
  return (
    <BasePage>
      <div className="flex flex-col items-center justify-center h-full space-y-60 px-16">
        <div className="text-center">
          <div className="flex items-center justify-center mb-8">
            <img
              src="/logo/mjs_logo_text.png"
              alt="logo-mjs-center"
              className="w-auto h-16"
            />
          </div>
          <p
            className="text-5xl font-light text-gray-700 mb-8"
            style={{
              fontSize: "3rem",
              fontWeight: 300,
              color: "#374151",
              marginBottom: "2rem",
              lineHeight: "1.2",
            }}
          >
            MJ Solution Indonesia
          </p>

          <div
            className="flex items-center justify-center text-gray-600"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "2rem",
              color: "#4B5563",
            }}
          >
            <span className="leading-none" style={{ lineHeight: 1 }}>
              EXPLORE
            </span>
            <div
              className="w-2 h-2 bg-black rounded-full flex-shrink-0"
              style={{
                width: "0.5rem",
                height: "0.5rem",
                backgroundColor: "#000",
                borderRadius: "9999px",
                flexShrink: 0,
                position: "relative",
                top: "1px",
              }}
            ></div>
            <span className="leading-none" style={{ lineHeight: 1 }}>
              CREATE
            </span>
            <div
              className="w-2 h-2 bg-black rounded-full flex-shrink-0"
              style={{
                width: "0.5rem",
                height: "0.5rem",
                backgroundColor: "#000",
                borderRadius: "9999px",
                flexShrink: 0,
                position: "relative",
                top: "1px",
              }}
            ></div>
            <span className="leading-none" style={{ lineHeight: 1 }}>
              INSPIRE
            </span>
          </div>
        </div>

        <div className="text-center space-y-6 w-[350px]">
          <p
            className="text-gray-700 font-light"
            style={{ fontWeight: 300, fontSize: "2rem", lineHeight: "1.2" }}
          >
            {data?.userName || "Muhammad Faris"}
          </p>

          <div className="text-sm text-gray-600">
            Date of Configuration {data?.exportDate || "16-03-2025"}
          </div>

          <div className="border-b border-gray-400"></div>

          <p className="text-base text-gray-600 font-medium">
            {data?.displayType || "Indoor LED Fixed"}{" "}
            {data?.pixelPitch ? `${data.pixelPitch}` : "P 1.86"}
          </p>
        </div>
      </div>
    </BasePage>
  );
};
