import {Dimensions} from 'react-native';

export const AddToSequenceString =
"You can add photo or video to your sequence here. \nSelect one media and tap 'Add to Sequence' button to add."

export const ExportString =
"You can add and delete media from current sequence here. \nAll media on current sequence can be selected on slider and it will be shown on preview section. \n\nVideo will be auto-played on preview section. \n\n\nTap 'Select Mood' button to continue to choose video mood and format."

export const MergeVideoString =
"You can review your modification and process your project. \n\nTap 'Process My Video' button to begin merging media process. \nProgress will be shown on screen. \n\nAfter project is processed, final media will be shown on preview section on current screen. \n\nYou can tap 'View Exported Projects'  button to see your exported projects and share them."

export const SelectMoodString =
"You can select mood and format here. \n\nMood will affect video playing speed and background music. \n\n- Summer Vibes: \nVideo will be played on 0.5x speed and will have summer song as background audio.\n\n- Action: \nVideo will be played on 2x speed and will have action song as background audio.\n\n- Adventure: \nVideo will be played on 4x speed and will have adventure song as background audio. \n\nFormat will affect video aspect ratio and duration. \n\n- Instagram Story: \nVideo will be sized on 9:16 ratio (portrait) and will have maximum duration on 15 seconds.\n\n- Youtube: \nVideo will be sized on 16:9 ratio (landscape) and will have no maximum duration. \n\nTap 'Export' to review final modification for your project."

export const NewProjectString =
"You can create new project here. \n\nProject name must be unique."

export const SelectProjectString =
"You can select and load your previous projects here. \n\nCurrent loaded project sequence will be previewed on page."

export const ViewExportedProjectString =
"You can select and share your exported project video here. \n\nSelect one media and tap 'Share' button to then select sharing platform."

export const widthRatio = Dimensions.get('window').width / 412
export const heightRatio = Dimensions.get('window').width / 684