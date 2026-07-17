import { useState } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import PreferenceCard from "./PreferenceCard";

export default function Preferences() {
 /*    const [emailNotif, setEmailNotif] = useState(true);
    const [autoSave, setAutoSave] = useState(true); */
    const { darkMode, setDarkMode } = useTheme();

    return (

                    <div>
                        {/* RIGHT SIDE */}
                      

                            <h2 className="text-3xl font-bold mb-10">
                                Preference
                            </h2>

                            {/* Email Notification */}
                            {/* <PreferenceCard
                                title="Email Notification"
                                description="Receive updates about student progress"
                                checked={emailNotif}
                                onChange={() => setEmailNotif(!emailNotif)}
                            /> */}

                            {/* Auto Save */}
                            {/* <PreferenceCard
                                title="Auto - Save"
                                description="Automatically save exercise progress"
                                checked={autoSave}
                                onChange={() => setAutoSave(!autoSave)}
                            /> */}

                            {/* Dark Mode */}
                            <PreferenceCard
                                title="Dark Mode"
                                description="Enable dark theme interface"
                                checked={darkMode}
                                onChange={() => {
                                    console.log("Clicked");
                                    console.log(darkMode);
                                    setDarkMode(!darkMode);
                                }}
                            />
                    

                    </div>
               
    );
};
