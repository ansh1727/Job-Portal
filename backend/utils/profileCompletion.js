const calculateProfileCompletion = (profile = {}) => {
  const fields = [
    { key: 'phone', weight: 10 },
    { key: 'skills', weight: 15, check: (v) => Array.isArray(v) && v.length > 0 },
    { key: 'education', weight: 15, check: (v) => Array.isArray(v) && v.length > 0 },
    { key: 'experience', weight: 15, check: (v) => Array.isArray(v) && v.length > 0 },
    { key: 'linkedin', weight: 10 },
    { key: 'github', weight: 10 },
    { key: 'portfolio', weight: 10 },
    { key: 'resume', weight: 15, check: (v) => v?.url },
  ];

  let completion = 0;

  fields.forEach(({ key, weight, check }) => {
    const value = profile[key];
    const isComplete = check ? check(value) : Boolean(value);
    if (isComplete) completion += weight;
  });

  return Math.min(completion, 100);
};

module.exports = { calculateProfileCompletion };
