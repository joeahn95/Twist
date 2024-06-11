"use client";

const StreamScreen: React.FC<any> = ({ isLive }) => {
  return (
    <div className="border-2" style={{ width: 560, height: 315 }}>
      {isLive ? (
        <iframe
          width="556"
          height="311"
          src="https://www.youtube.com/embed/jfKfPfyJRdk?si=W0o7CPPctSO5rE04"
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        ></iframe>
      ) : (
        <p>{"not live :("}</p>
      )}
    </div>
  );
};

export default StreamScreen;
