import Card from "@/components/ui/Card";

import "@/styles/dashboard/financial-widget.css";
import "./AIInsights.css";

import {
  FaBolt,
  FaLightbulb,
} from "react-icons/fa6";

function AIInsights({ insights = [] }) {
  const visibleInsights = insights.slice(0, 3);

  return (
    <Card
      elevated
      className="financial-widget ai-card"
    >
      <div className="widget-header">
        <div className="ai-icon">
          <FaLightbulb />
        </div>

        <div className="widget-heading">
          <h3 className="widget-title">
            Smart Insights
          </h3>

          <p className="widget-subtitle">
            Signals from your financial activity
          </p>

          <span className="widget-pill ai-live-pill">
            <span className="ai-live-dot" />
            Live
          </span>
        </div>
      </div>

      <div className="insights-list">
        {visibleInsights.length === 0 ? (
          <div className="widget-empty-state ai-empty-state">
            <p>Insights are warming up</p>

            <span>
              More transaction history will unlock
              personalized financial signals.
            </span>
          </div>
        ) : (
          visibleInsights.map((insight, index) => (
            <div
              key={`${insight}-${index}`}
              className="insight-card"
            >
              <span className="insight-signal">
                <FaBolt />
              </span>

              <span>{insight}</span>
            </div>
          ))
        )}
      </div>

      <div className="widget-footer ai-footer">
        <span className="ai-footer-dot" />
        Updates automatically with your activity
      </div>
    </Card>
  );
}

export default AIInsights;
