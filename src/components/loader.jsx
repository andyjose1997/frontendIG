import './loader.css';

export default function Loader() {
    return (
        <div className="loader-bg">
            <div className="loader-core">
                <div className="loader-glow"></div>
                <div className="loader-ring"></div>
                <div className="loader-ring delay"></div>
                <div className="loader-spark"></div>
            </div>
            <h1 className="loader-title">IronGoals</h1>
            <p className="loader-text">Preparando sua experiência...</p>
        </div>
    );
}
