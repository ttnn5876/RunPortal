import React, { useEffect } from 'react'
import { Button, LargeTitle, Body2, Skeleton, SkeletonItem, FluentProvider, makeStyles, Title3 } from '@fluentui/react-components'
import { useThemeChange, isMica, getTheme, getButtonShape} from './theme'
import { ipcRenderer, linksData, refreshLinks } from './ipc'

interface LinkButtonContainerProps {
    links: {
        appName: string,
        linkPath: string,
        shortcutText: string
    }[],
}

const useStyles = makeStyles({
    provider: {
        transitioProperty: 'opacity',
        transitionDuration: '3s',
        transitionTimingFunction: 'ease-in-out'
    },
    linkButtonContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: '30px',
        textAlign: 'center',
    },
    linkButton: {
        marginTop: '12px',
        marginBottom: '12px'
    },
    linkButtonContainerButton: {
        marginRight: '10px',
        marginLeft: '10px',
        marginTop: '3px'
    },
    linkButtonContainerText: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '10px',
        textAlign: 'center'
    },
    skeleton: {
        marginBottom: '10px',
        marginLeft: '10px',
        marginRight: '10px',
    },
    noLinksPrompt: {
        textAlign: 'center',
        marginTop: '50px',
        marginBottom: '80px'
    }
})

const LinkButtonContainer: React.FC<LinkButtonContainerProps> = ({ links }) => {
    
    const styles = useStyles()

    interface LinkButtonProps {
        shortcutText: string,
        linkPath: string,
    }
    
    const LinkButton: React.FC<LinkButtonProps> = ({ shortcutText, linkPath }) => {    

        // To open the links on button press
        const mouseClickHandler = () => {
            ipcRenderer.send("button-press", linkPath)
        }
        
        document.addEventListener('keyup', (event) => {
            if (event.key.toUpperCase() == shortcutText) {
                ipcRenderer.send("button-press", linkPath)
            }
        })

        return (
            <div>
                <Button
                    shape={getButtonShape()}
                    size='large'
                    appearance='subtle' // Pretty!
                    onMouseUp={mouseClickHandler}>
                    <div className={styles.linkButton}>
                        <LargeTitle>{shortcutText}</LargeTitle>
                    </div>
                </Button>
            </div>
        )
    }
    
    if (links.length == 0) {
        return (
            <div className={styles.noLinksPrompt}>
                <Title3>
                    To add shortcuts select go to the tray icon and selet "Edit Shortcuts"
                </Title3>
            </div>
        )
    }
    
    return (
        <div className={styles.linkButtonContainer}>
            {links.map((link, _) => (
                <div key={'u'+link.appName}>
                    <div className={styles.linkButtonContainerButton}>
                        <LinkButton shortcutText={link.shortcutText} linkPath={link.linkPath}/>
                    </div>
                    <div className={styles.linkButtonContainerText}>
                        <Body2>{link.appName}</Body2>   
                    </div>
                </div>
            ))}
        </div>
    )
}

// Just something nice to liven up the window
const BottomBar: React.FC = () => {
    const styles = useStyles()
    return (
        <Skeleton appearance={isMica() ? 'opaque' : 'translucent'} className={styles.skeleton}>
            <SkeletonItem />
        </Skeleton>
    )
}

export const App: React.FC = () => {

    useEffect(() => {
        refreshLinks()
    })
    const styles = useStyles()

    const isDarkTheme = useThemeChange()
    return (
        <FluentProvider theme={isDarkTheme ? getTheme().dark : getTheme().light}
        onLoad={refreshLinks} className={styles.provider}>
            <LinkButtonContainer links={linksData}/>
            <BottomBar/>
        </FluentProvider>
    )
}