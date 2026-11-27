export const SkillTags = ({
  skills,
  max = 3,
}: {
  skills: string[];
  max?: number;
}) => {
  if (!skills || skills.length === 0) return null;
  const visible = skills.slice(0, max);
  const overflow = skills.length - max;

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {visible.map((skill) => (
        <span
          key={skill}
          className="inline-block rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground"
        >
          {skill}
        </span>
      ))}
      {overflow > 0 && (
        <span className="text-xs font-medium text-muted-foreground">
          +{overflow}
        </span>
      )}
    </div>
  );
};
