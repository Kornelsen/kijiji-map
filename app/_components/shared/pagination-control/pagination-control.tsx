import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";

type Props = {
	page: number;
	totalPages: number;
	handlePageChange: (page: number) => void;
};

const PAGINATION_OPTIONS = 6;

export const PaginationControl = ({
	page,
	totalPages,
	handlePageChange,
}: Props) => {
	const handlePrevPage = () => {
		if (page === 0) return;
		handlePageChange(page - 1);
	};

	const handleNextPage = () => {
		if (page === totalPages - 1) return;
		handlePageChange(page + 1);
	};

	const activePage = page + 1;

	return (
		<Pagination>
			<PaginationContent>
				<PaginationItem>
					<PaginationPrevious onClick={handlePrevPage} />
				</PaginationItem>
				{page > 0 && <PaginationEllipsis />}
				{Array.from({ length: PAGINATION_OPTIONS }).map((_, i) => {
					let index = i + 1 + page;
					const remainingPages = totalPages - page;
					if (remainingPages < PAGINATION_OPTIONS) {
						index = index - (PAGINATION_OPTIONS - remainingPages);
					}
					if (index > totalPages || index < 1) return null;
					return (
						<PaginationItem key={index}>
							<PaginationLink
								onClick={() => handlePageChange(index - 1)}
								isActive={activePage === index}
							>
								{index}
							</PaginationLink>
						</PaginationItem>
					);
				})}
				{page + PAGINATION_OPTIONS < totalPages && <PaginationEllipsis />}
				<PaginationItem>
					<PaginationNext onClick={handleNextPage} />
				</PaginationItem>
			</PaginationContent>
		</Pagination>
	);
};
