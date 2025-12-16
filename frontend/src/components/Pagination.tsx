import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination"



interface PaginationProps {
	page: number,
	setPage: React.Dispatch<React.SetStateAction<number>>,
	totalPages: number
}

const PaginationComponent = ({ page, setPage, totalPages }: PaginationProps) => {
	return (
		<Pagination>
			<PaginationContent className="flex gap-0 items-center">
				<PaginationItem>
					<PaginationPrevious
						size={"sm"}
						href="#"
						onClick={(e) => {
							e.preventDefault()
							setPage(p => Math.max(1, p - 1))
						}}
						className={page === 1 ? "pointer-events-none opacity-50" : "no-underline hover:bg-accent"}
					/>
				</PaginationItem>

				{/* First page */}
				<PaginationItem>
					<PaginationLink
						size={"sm"}
						href="#"
						onClick={(e) => {
							e.preventDefault()
							setPage(1)
						}}
						isActive={page === 1}
						className="no-underline"
					>
						1
					</PaginationLink>
				</PaginationItem>

				{/* Left ellipsis */}
				{page > 3 && totalPages > 5 && (
					<PaginationItem>
						<PaginationEllipsis />
					</PaginationItem>
				)}

				{/* Middle pages */}
				{Array.from({ length: totalPages }, (_, i) => i + 1)
					.filter(pageNum => {
						// Show pages around current page
						if (pageNum === 1 || pageNum === totalPages) return false
						if (totalPages <= 5) return true // Show all middle pages if total <= 5
						return Math.abs(pageNum - page) <= 1 // Show current ± 1
					})
					.map(pageNum => (
						<PaginationItem key={pageNum}>
							<PaginationLink
								size={"sm"}
								href="#"
								onClick={(e) => {
									e.preventDefault()
									setPage(pageNum)
								}}
								isActive={page === pageNum}
								className="no-underline"
							>
								{pageNum}
							</PaginationLink>
						</PaginationItem>
					))}

				{/* Right ellipsis */}
				{page < totalPages - 2 && totalPages > 5 && (
					<PaginationItem>
						<PaginationEllipsis />
					</PaginationItem>
				)}

				{/* Last page */}
				{totalPages > 1 && (
					<PaginationItem>
						<PaginationLink
							size={"sm"}
							href="#"
							onClick={(e) => {
								e.preventDefault()
								setPage(totalPages)
							}}
							isActive={page === totalPages}
							className="no-underline"
						>
							{totalPages}
						</PaginationLink>
					</PaginationItem>
				)}

				<PaginationItem>
					<PaginationNext
						size={"sm"}
						href="#"
						onClick={(e) => {
							e.preventDefault()
							setPage(p => Math.min(totalPages, p + 1))
						}}
						className={page === totalPages ? "pointer-events-none opacity-50 " : "no-underline hover:bg-accent"}
					/>
				</PaginationItem>
			</PaginationContent>
		</Pagination>
	)
}
export default PaginationComponent