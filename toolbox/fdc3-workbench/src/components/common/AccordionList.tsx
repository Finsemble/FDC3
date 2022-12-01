import React from "react";
import { List, ListItem, ListItemText, Typography, ListItemSecondaryAction, IconButton } from "@mui/material";
import { Theme } from "@mui/material/styles";
import { AccordionContent } from "./AccordionContent";
import DeleteIcon from "@mui/icons-material/Delete";
import { makeStyles } from 'tss-react/mui';

export interface AccordionListItem {
	id: string;
	textPrimary: string;
	afterEachElement?: React.ReactNode;
}

export interface AccordionListProps {
	title: string;
	icon?: string;
	listItems: AccordionListItem[];
	noItemsText: string;
	onDelete?: (id: string) => void;
}

const useStyles = makeStyles()((theme: Theme) => {
	return {
		list: {
			padding: 0,
			width: "100%",
		},
		listItem: {
			padding: 0,
			"&.MuiListItem-secondaryAction": {
				paddingRight: theme.spacing(6),
			},
		},
		listAction: {
			top: "2px",
			transform: "none",
		},
	};
});

export const AccordionList: React.FC<AccordionListProps> = ({
	title,
	icon,
	listItems,
	noItemsText,
	onDelete,
}: AccordionListProps) => {
	const { classes } = useStyles();

	const handleDelete = (id: string) => () => {
		if (onDelete) {
			onDelete(id);
		}
	};

	return (
		<AccordionContent title={title} icon={icon}>
			{!listItems.length && <Typography variant="body1">{noItemsText}</Typography>}
			{!!listItems.length && (
				<List className={classes.list}>
					{listItems.map(({ id, textPrimary, afterEachElement }) => (
						<ListItem key={id} className={classes.listItem} disableGutters>
							<ListItemText disableTypography primary={textPrimary} secondary={afterEachElement} />
							<ListItemSecondaryAction className={classes.listAction}>
								{onDelete && (
									<IconButton size="small" edge="end" aria-label="delete" onClick={handleDelete(id)}>
										<DeleteIcon />
									</IconButton>
								)}
							</ListItemSecondaryAction>
						</ListItem>
					))}
				</List>
			)}
		</AccordionContent>
	);
};
