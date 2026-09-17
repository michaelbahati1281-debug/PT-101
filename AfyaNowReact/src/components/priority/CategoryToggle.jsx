import { serviceCategories } from "../../data/categories";

/* =========================================================
   CATEGORY TOGGLE — Standard vs Priority/Convenience

   compact: chip-style row, used as a list filter.
   (default) detailed: card-style with description + optional
   extra fee, used in the booking flow.
========================================================= */

function CategoryToggle({ value, onChange, availableIds, compact = false, priorityFeeExtra = 0 }) {
  const options = availableIds
    ? serviceCategories.filter((category) => availableIds.includes(category.id))
    : serviceCategories;

  if (compact) {
    return (
      <div className="category-toggle-compact">
        {options.map((category) => (
          <button
            key={category.id}
            type="button"
            className={`category-button${value === category.id ? " active" : ""}`}
            onClick={() => onChange(category.id)}
          >
            {category.label}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="category-toggle-detailed">
      {options.map((category) => {
        const Icon = category.icon;
        const isActive = value === category.id;
        const showFee = category.id === "priority" && priorityFeeExtra > 0;

        return (
          <button
            key={category.id}
            type="button"
            className={`category-card${isActive ? " selected" : ""}`}
            onClick={() => onChange(category.id)}
          >
            <Icon size={20} />
            <div>
              <strong>{category.label}</strong>
              <p>{category.description}</p>
              {showFee && (
                <span className="category-card-fee">
                  +TSh {priorityFeeExtra.toLocaleString()}
                </span>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}

export default CategoryToggle;
