import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import {fade} from '@material-ui/core/styles';
import {NavTextColor, SearchBackground} from './constants';
import {Button} from '@material-ui/core';
import Badge from '@material-ui/core/Badge';
import KeyboardDown from '@material-ui/icons/KeyboardArrowDown';
// import keydown from 'react-keydown';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import {primary} from '../../theme';
import Divider from '@material-ui/core/Divider';

const styles = theme => ({
	root: {
		flexGrow: 1,
	},
	appBar: {
		borderBottom: '1px solid #e2e2e2'
	},
	menuButton: {
		left: 8,
		color: NavTextColor,
	},
	title: {
		display: 'none',
		color: NavTextColor,
		[theme.breakpoints.up('sm')]: {
			display: 'block',
		},
	},
	spacer: {
		flexGrow: 1,
	},
	search: {
		position: 'relative',
		borderRadius: theme.shape.borderRadius,
		backgroundColor: fade(SearchBackground, 0.15),
		'&:hover': {
			backgroundColor: fade(SearchBackground, 0.25),
		},
		marginLeft: 0,
		width: '100%',
		[theme.breakpoints.up('sm')]: {
			marginLeft: theme.spacing(1),
			width: 'auto',
		},
	},
	searchIcon: {
		width: theme.spacing(7),
		color: NavTextColor,
		height: '100%',
		position: 'absolute',
		pointerEvents: 'none',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	},
	inputRoot: {
		color: 'NavTextColor',
	},
	inputInput: {
		padding: theme.spacing(1, 1, 1, 7),
		transition: theme.transitions.create('width'),
		width: '100%',
		[theme.breakpoints.up('sm')]: {
			width: 120,
			'&:focus': {
				width: 200,
			},
		},
	},
	toggleButton: {
		height: 28,
		// borderColor: primary,
		color: primary
	},
	toggleButtonSelected: {
		backgroundColor: `${primary} !important`,
		color: `white !important`
	}
});

class TopBar extends React.Component {

	// @keydown('ctrl+f')
	// searchKeys() {
	// 	debugger
	// }

	render() {
		const {classes} = this.props;
		return (
			<div className={classes.root}>
				<AppBar position="static" style={{backgroundColor: 'white'}} elevation={0} className={classes.appBar}>
					<Toolbar variant="dense">
						<Typography className={classes.title} variant="h6" noWrap>
							Stripe Checkout API
						</Typography>

						<IconButton
							edge="start"
							className={classes.menuButton}
							color="inherit"
							onClick={this.props.toggleSuperMenu}
							size="small"
						>
							<KeyboardDown/>
						</IconButton>

						<div className={classes.spacer}/>

						<ToggleButtonGroup value={'documentation'} exclusive size="small" style={{marginRight: 22}}
										   className={classes.toggleGroup}>
							<ToggleButton value="documentation" className={classes.toggleButton}
										  classes={{selected: classes.toggleButtonSelected}}>
								Documentation
							</ToggleButton>
							<ToggleButton value="design" className={classes.toggleButton}
										  classes={{selected: classes.toggleButtonSelected}}>
								Design
							</ToggleButton>
						</ToggleButtonGroup>

						<Button color="primary">
							Proposals (2)
						</Button>
						<Button color="primary">
							Help
						</Button>
						<Button color="secondary">
							Share
						</Button>
						{/*<div className={classes.search}>*/}
						{/*	<div className={classes.searchIcon}>*/}
						{/*		<SearchIcon />*/}
						{/*	</div>*/}
						{/*	<InputBase*/}
						{/*		placeholder="Search…"*/}
						{/*		classes={{*/}
						{/*			root: classes.inputRoot,*/}
						{/*			input: classes.inputInput,*/}
						{/*		}}*/}
						{/*		inputProps={{ 'aria-label': 'Search' }}*/}
						{/*	/>*/}
						{/*</div>*/}
					</Toolbar>
				</AppBar>
			</div>
		);
	}
}


export default withStyles(styles)(TopBar);