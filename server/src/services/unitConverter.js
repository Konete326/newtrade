const convertToBase = (quantity, unitLevel, unitHierarchy) => {
  const { baseUnit, secondaryUnit, tertiaryUnit } = unitHierarchy;
  if (unitLevel === 'base' || unitLevel === baseUnit.name.toLowerCase()) {
    return quantity * baseUnit.factor;
  }
  if (unitLevel === 'secondary' || unitLevel === secondaryUnit.name.toLowerCase()) {
    return quantity * secondaryUnit.factor;
  }
  if (unitLevel === 'tertiary' || unitLevel === tertiaryUnit.name.toLowerCase()) {
    return quantity * tertiaryUnit.factor;
  }
  return quantity;
};

const convertFromBase = (baseQuantity, unitHierarchy) => {
  const { baseUnit, secondaryUnit, tertiaryUnit } = unitHierarchy;
  let remaining = baseQuantity;
  const result = { tertiary: 0, secondary: 0, base: 0 };
  if (tertiaryUnit.factor > 1) {
    result.tertiary = Math.floor(remaining / tertiaryUnit.factor);
    remaining = remaining % tertiaryUnit.factor;
  }
  if (secondaryUnit.factor > 1) {
    result.secondary = Math.floor(remaining / secondaryUnit.factor);
    remaining = remaining % secondaryUnit.factor;
  }
  result.base = remaining;
  return result;
};

const formatStock = (baseQuantity, unitHierarchy) => {
  const converted = convertFromBase(baseQuantity, unitHierarchy);
  const parts = [];
  const { tertiaryUnit, secondaryUnit, baseUnit } = unitHierarchy;
  if (converted.tertiary > 0 && tertiaryUnit.name) {
    parts.push(`${converted.tertiary} ${tertiaryUnit.name}`);
  }
  if (converted.secondary > 0 && secondaryUnit.name) {
    parts.push(`${converted.secondary} ${secondaryUnit.name}`);
  }
  if (converted.base > 0 || parts.length === 0) {
    parts.push(`${converted.base} ${baseUnit.name}`);
  }
  return parts.join(', ');
};

module.exports = { convertToBase, convertFromBase, formatStock };
