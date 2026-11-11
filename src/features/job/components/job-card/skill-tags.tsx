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
          className="inline-block rounded-md bg-secondary/60 px-2 py-0.5 text-[11px] font-medium text-secondary-foreground/70 dark:bg-white/[0.05] dark:text-white/70 transition-colors hover:bg-primary/10 hover:text-primary dark:hover:bg-primary/20 dark:hover:text-primary-foreground cursor-default"
        >
          {skill}
        </span>
      ))}
      {overflow > 0 && (
        <span className="text-[11px] text-muted-foreground/60 font-medium">
          +{overflow}
        </span>
      )}
    </div>
  );
};
