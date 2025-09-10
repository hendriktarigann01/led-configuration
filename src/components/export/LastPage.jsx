import { BasePage } from "./BasePage";

export const LastPage = () => {
    const containerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '2rem',
    color: '#4B5563',
    fontFamily: 'Arial, sans-serif',
    fontSize: '14px',
    fontWeight: '500',
    padding: '1rem 0'
  };

  const textStyle = {
    lineHeight: '1',
    whiteSpace: 'nowrap'
  };

  const dotStyle = {
    width: '0.5rem',
    height: '0.5rem',
    backgroundColor: '#000',
    borderRadius: '50%',
    flexShrink: 0
  };

  return (
    <BasePage>
      <div className="flex flex-col items-center justify-center h-full">
        <div className="text-center">
          <div className="flex items-center justify-center mb-8">
            <img
              src="/logo/mjs_logo.png"
              alt="logo-mjs"
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
          <div style={containerStyle}>
            <span style={textStyle}>EXPLORE</span>
            <div style={dotStyle}></div>
            <span style={textStyle}>CREATE</span>
            <div style={dotStyle}></div>
            <span style={textStyle}>INSPIRE</span>
          </div>
        </div>
      </div>
      {/* Footer */}
      <div className="absolute bottom-6 left-8 text-[10px] space-y-2 text-gray-600">
        <h1 className="font-semibold">MJ Solution Indonesia</h1>
        <p>
          The Mansion Bougenville Kemayoran Tower Fontana Zona I Lantai 50
          Kemayoran Jakarta Utara
        </p>
        <div className="flex items-center space-x-4">
          {/* Website */}
          <div className="inline-flex items-center space-x-1">
            <img
              src="/icons/icon-web.svg"
              className="w-4 h-4 relative top-[1px]"
              alt="web"
            />
            <span className="leading-[1]">mjsolution.co.id</span>
          </div>

          {/* Phone */}
          <div className="inline-flex items-center space-x-1">
            <img
              src="/icons/icon-call.svg"
              className="w-4 h-4 relative top-[1px]"
              alt="phone"
            />
            <span className="leading-[1]">(+62) 811-1122-492</span>
          </div>
        </div>
      </div>
    </BasePage>
  );
};
