import * as React from "react"

type Task = {
    id: string
    name: string
    completed: boolean
}

type Milestone = {
    id: string
    title: string
    description?: string
    tasks: Task[]
    completed: boolean
}

type Props = {
    milestones: Milestone[]
}

export function MilestoneTracker(props: Props) {
    const { milestones } = props
    const [expanded, setExpanded] = React.useState<Record<string, boolean>>({})
    const [tasksState, setTasksState] = React.useState(() => {
        const state: Record<string, boolean> = {}
        milestones.forEach((m) =>
            m.tasks.forEach((t) => {
                state[t.id] = t.completed
            })
        )
        return state
    })

    const toggleTask = (taskId: string) => {
        setTasksState((prev) => ({
            ...prev,
            [taskId]: !prev[taskId],
        }))
    }

    const toggleMilestone = (id: string) => {
        setExpanded((prev) => ({
            ...prev,
            [id]: !prev[id],
        }))
    }

    const completedMilestones = milestones.filter((m) => m.completed).length
    const progress = (completedMilestones / milestones.length) * 100

    return (
        <div
            style={{
                width: "100%",
                padding: 16,
                fontFamily: "Inter, sans-serif",
                overflowX: "auto",
            }}
        >
            {/* Progress Bar */}
            <div style={{ width: "100%", height: 6, background: "#eee", borderRadius: 3, marginBottom: 16 }}>
                <div
                    style={{
                        width: `${progress}%`,
                        height: "100%",
                        background: "#4CAF50",
                        borderRadius: 3,
                        transition: "width 0.3s",
                    }}
                />
            </div>

            {/* Horizontal Milestone Track */}
            <div style={{ display: "flex", gap: 16, minWidth: "max-content" }}>
                {milestones.map((milestone) => {
                    const isComplete = milestone.completed
                    const isExpanded = expanded[milestone.id] ?? true
                    return (
                        <div
                            key={milestone.id}
                            style={{
                                minWidth: 240,
                                flexShrink: 0,
                                borderRadius: 8,
                                padding: 16,
                                border: `2px solid ${isComplete ? "#4CAF50" : "#ccc"}`,
                                background: isComplete ? "#F1FAF1" : "#fff",
                                boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                                transition: "all 0.3s",
                            }}
                        >
                            <div
                                style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}
                                onClick={() => toggleMilestone(milestone.id)}
                            >
                                <h3 style={{ margin: 0, fontSize: 16 }}>
                                    {isComplete ? "✅" : "🕒"} {milestone.title}
                                </h3>
                                <span style={{ fontSize: 18 }}>{isExpanded ? "−" : "+"}</span>
                            </div>

                            {milestone.description && (
                                <p style={{ margin: "8px 0", color: "#666", fontSize: 13 }}>{milestone.description}</p>
                            )}

                            {isExpanded && (
                                <ul style={{ paddingLeft: 0, marginTop: 12, listStyle: "none" }}>
                                    {milestone.tasks.map((task) => (
                                        <li
                                            key={task.id}
                                            style={{
                                                marginBottom: 8,
                                                fontSize: 14,
                                                display: "flex",
                                                alignItems: "center",
                                            }}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={tasksState[task.id]}
                                                onChange={() => toggleTask(task.id)}
                                                style={{ marginRight: 8 }}
                                            />
                                            <span
                                                style={{
                                                    textDecoration: tasksState[task.id] ? "line-through" : "none",
                                                    color: tasksState[task.id] ? "#4CAF50" : "#333",
                                                }}
                                            >
                                                {task.name}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

// Preview props
MilestoneTracker.defaultProps = {
    milestones: [
        {
            id: "m1",
            title: "Planning",
            description: "Define project scope and goals.",
            completed: true,
            tasks: [
                { id: "t1", name: "Initial call", completed: true },
                { id: "t2", name: "Brief outline", completed: true },
            ],
        },
        {
            id: "m2",
            title: "Design",
            description: "Create wireframes and UI designs.",
            completed: false,
            tasks: [
                { id: "t3", name: "Wireframes", completed: true },
                { id: "t4", name: "UI design", completed: false },
            ],
        },
        {
            id: "m3",
            title: "Development",
            description: "Build frontend and backend features.",
            completed: false,
            tasks: [
                { id: "t5", name: "Component setup", completed: false },
                { id: "t6", name: "API integration", completed: false },
            ],
        },
    ],
}