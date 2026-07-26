import { useNavigate } from "react-router-dom";

import {
  FaArrowRight,
  FaReceipt,
} from "react-icons/fa6";

import { categoryIcons } from "../../utils/categoryIcons";

import "./RecentTransactions.css";

function RecentTransactions({
  transactions = [],
  currency = "INR",
}) {
  const navigate = useNavigate();

  const formatter = new Intl.NumberFormat(
    "en-IN",
    {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }
  );

  const visibleTransactions =
    transactions.slice(0, 5);

  return (
    <div className="dashboard-widget recent-transactions">

      <div className="recent-header">

        <div>
          <span className="recent-eyebrow">
            ACTIVITY
          </span>

          <h3>
            Recent Transactions
          </h3>

          <p>
            Your latest recorded expenses.
          </p>
        </div>

        <button
          type="button"
          className="view-all-btn"
          onClick={() =>
            navigate("/expenses")
          }
        >
          <span>History</span>
          <FaArrowRight />
        </button>

      </div>

      {visibleTransactions.length === 0 ? (

        <div className="recent-empty">

          <div className="recent-empty-icon">
            <FaReceipt />
          </div>

          <h4>
            No transactions yet
          </h4>

          <p>
            Expenses you add will appear here
            for quick access.
          </p>

          <button
            type="button"
            onClick={() =>
              navigate("/expenses")
            }
          >
            Add an expense
            <FaArrowRight />
          </button>

        </div>

      ) : (

        <div className="transaction-list">

          {visibleTransactions.map(
            (transaction, index) => {

              const title =
                transaction.title ||
                transaction.category ||
                "Expense";

              const category =
                transaction.category ||
                "Other";

              const date =
                transaction.date
                  ? new Date(
                      transaction.date
                    ).toLocaleDateString(
                      "en-IN",
                      {
                        day: "2-digit",
                        month: "short",
                      }
                    )
                  : "--";

              return (
                <button
                  type="button"
                  key={
                    transaction._id ||
                    `${title}-${index}`
                  }
                  className="transaction-item"
                  onClick={() =>
                    navigate("/expenses")
                  }
                >

                  <div className="transaction-left">

                    <div className="transaction-icon">
                      {categoryIcons[
                        category
                      ] ||
                        categoryIcons.Other}
                    </div>

                    <div className="transaction-copy">

                      <h4>
                        {title}
                      </h4>

                      <span>
                        {category}
                        <i />
                        {date}
                      </span>

                    </div>

                  </div>

                  <div className="transaction-value">

                    <strong>
                      -
                      {formatter.format(
                        Number(
                          transaction.amount
                        ) || 0
                      )}
                    </strong>

                    <span>
                      Expense
                    </span>

                  </div>

                </button>
              );
            }
          )}

        </div>

      )}

      <div className="recent-footer">

        <span>
          SmartMoney Activity
        </span>

        <span className="recent-live">
          <i />
          Synced
        </span>

      </div>

    </div>
  );
}

export default RecentTransactions;
