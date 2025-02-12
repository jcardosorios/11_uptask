import { useDroppable } from "@dnd-kit/core"

type DropTaskProps = {
    status: string
}


export default function DropTask({ status } : DropTaskProps) {

    const { isOver, setNodeRef } = useDroppable({
        id: status
    })

    const style = {
        opacity: isOver ? 0.4 : undefined,
        paddingTop: isOver ? 60 : 8,
        paddingBottom: isOver ? 60 : 8

    }

    return (
        <div
            style={style}
            ref={setNodeRef}
            className="text-xs font-semibold uppercase border border-dashed border-slate-500 mt-5 p-2 grid place-content-center text-slate-500  "
        >
            Drop Task Here
        </div>
    )
}
