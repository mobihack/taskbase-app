export const TaskEmpty = (): JSX.Element => {
  return (
    <div className="text-center text-gray-600">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/assets/illustrations/note-taking.svg"
        className="w-1/3 mx-auto"
        alt=""
      />
      <p>No tasks found. Add a task to get started.</p>
    </div>
  );
};
