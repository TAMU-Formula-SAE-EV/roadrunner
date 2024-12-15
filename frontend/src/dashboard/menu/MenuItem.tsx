import "./styles.css";

interface MenuItemProps {
    title: String;
};

export const MenuItem: React.FC<MenuItemProps> = ({title}) => {
    return <div className="menu-item-container"><h1>{title}</h1></div>;
};
