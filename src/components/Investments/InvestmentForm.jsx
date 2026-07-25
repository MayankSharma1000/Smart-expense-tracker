function InvestmentForm({
  formData,
  handleChange,
  handleSubmit,
  isEditing,
  submitLoading
}) {
  return (
    <form
      className="investment-form"
      onSubmit={handleSubmit}
    >

      <label className="investment-field investment-field-full">
        <span>Investment Name</span>

        <input
          type="text"
          name="name"
          placeholder="e.g. Tata Motors"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </label>

      <label className="investment-field investment-field-full">
        <span>Platform</span>

        <input
          type="text"
          name="platform"
          placeholder="e.g. Zerodha, Groww, CoinDCX"
          value={formData.platform}
          onChange={handleChange}
        />
      </label>

      <label className="investment-field investment-field-full">
        <span>Type</span>

        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
        >
          <option value="Stock">Stock</option>
          <option value="Mutual Fund">Mutual Fund</option>
          <option value="ETF">ETF</option>
          <option value="Crypto">Crypto</option>
          <option value="Gold">Gold</option>
          <option value="Bond">Bond</option>
          <option value="Fixed Deposit">
            Fixed Deposit
          </option>
          <option value="PPF">PPF</option>
          <option value="NPS">NPS</option>
          <option value="Other">Other</option>
        </select>
      </label>

      <div className="investment-form-row">

        <label className="investment-field">
          <span>Invested Amount</span>

          <input
            type="number"
            min="0"
            step="0.01"
            name="investedAmount"
            placeholder="e.g. 50000"
            value={formData.investedAmount}
            onChange={handleChange}
            required
          />
        </label>

        <label className="investment-field">
          <span>Current Value</span>

          <input
            type="number"
            min="0"
            step="0.01"
            name="currentValue"
            placeholder="e.g. 60000"
            value={formData.currentValue}
            onChange={handleChange}
            required
          />
        </label>

      </div>

      <label className="investment-field investment-field-full">
        <span>Purchase Date</span>

        <input
          type="date"
          name="purchaseDate"
          value={formData.purchaseDate}
          onChange={handleChange}
        />
      </label>

      <label className="investment-field investment-field-full">
        <span>Notes (Optional)</span>

        <textarea
          name="notes"
          rows="3"
          placeholder="Add any notes about this investment..."
          value={formData.notes}
          onChange={handleChange}
        />
      </label>

      <button
        className="investment-submit-btn"
        type="submit"
        disabled={submitLoading}
      >
        {submitLoading
          ? isEditing
            ? "Updating..."
            : "Adding..."
          : isEditing
            ? "Update Investment"
            : "Add Investment"}
      </button>

    </form>
  );
}

export default InvestmentForm;
