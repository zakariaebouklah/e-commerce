import React, {useState} from 'react';
import {useTheme} from "next-themes";

function Switch(props) {

    const { systemTheme, theme, setTheme } = useTheme();
    const currentTheme = theme === 'system' ? systemTheme : theme;

    const switchMode = () => {
        theme === "dark" ? setTheme("light") : setTheme("dark");
    }

    return (
        <>
            <label className="switch">
                <input type="checkbox" onChange={switchMode}/>
                <span className="slider"></span>
            </label>
        </>
    );
}

export default Switch;