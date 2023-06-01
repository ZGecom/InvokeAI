import {
  Box,
  Flex,
  Icon,
  IconButtonProps,
  Image,
  Spinner,
  Text,
} from '@chakra-ui/react';
import { useDroppable } from '@dnd-kit/core';
import IAIIconButton from 'common/components/IAIIconButton';
import ImageMetadataOverlay from 'common/components/ImageMetadataOverlay';
import { useGetUrl } from 'common/util/getUrl';
import { AnimatePresence, motion } from 'framer-motion';
import { SyntheticEvent } from 'react';
import { memo, useRef } from 'react';
import { FaImage, FaTimes } from 'react-icons/fa';
import { ImageDTO } from 'services/api';
import { v4 as uuidv4 } from 'uuid';

const PLACEHOLDER_MIN_HEIGHT = 48;

type IAISelectableImageProps = {
  image: ImageDTO | null | undefined;
  onChange: (image: ImageDTO) => void;
  onReset?: () => void;
  onError?: (event: SyntheticEvent<HTMLImageElement>) => void;
  resetIconSize?: IconButtonProps['size'];
};

const IAISelectableImage = (props: IAISelectableImageProps) => {
  const { image, onChange, onReset, onError, resetIconSize = 'md' } = props;
  const droppableId = useRef(uuidv4());
  const { getUrl } = useGetUrl();
  const { isOver, setNodeRef, active } = useDroppable({
    id: droppableId.current,
    data: {
      handleDrop: onChange,
    },
  });

  return (
    <Flex
      sx={{
        width: 'full',
        height: 'full',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}
      ref={setNodeRef}
    >
      {image && (
        <Flex
          sx={{
            w: 'full',
            position: 'relative',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Image
            src={getUrl(image.image_url)}
            fallbackStrategy="beforeLoadOrError"
            fallback={<ImageFallback />}
            onError={onError}
            draggable={false}
            sx={{
              borderRadius: 'base',
            }}
          />
          <ImageMetadataOverlay image={image} />
          {onReset && (
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                right: 0,
                p: 2,
              }}
            >
              <IAIIconButton
                size={resetIconSize}
                tooltip="Reset Image"
                aria-label="Reset Image"
                icon={<FaTimes />}
                onClick={onReset}
              />
            </Box>
          )}
          <AnimatePresence>
            {active && <DropOverlay isOver={isOver} />}
          </AnimatePresence>
        </Flex>
      )}
      {!image && (
        <>
          <Flex
            sx={{
              minH: PLACEHOLDER_MIN_HEIGHT,
              bg: 'base.850',
              w: 'full',
              h: 'full',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 'base',
            }}
          >
            <Icon
              as={FaImage}
              sx={{
                boxSize: 24,
                color: 'base.500',
              }}
            />
          </Flex>
          <AnimatePresence>
            {active && <DropOverlay isOver={isOver} />}
          </AnimatePresence>
        </>
      )}
    </Flex>
  );
};

export default memo(IAISelectableImage);

type DropOverlayProps = {
  isOver: boolean;
};

const DropOverlay = (props: DropOverlayProps) => {
  const { isOver } = props;
  return (
    <motion.div
      key="statusText"
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
        transition: { duration: 0.1 },
      }}
      exit={{
        opacity: 0,
        transition: { duration: 0.1 },
      }}
    >
      <Flex
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          w: 'full',
          h: 'full',
        }}
      >
        <Flex
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            w: 'full',
            h: 'full',
            bg: 'base.900',
            opacity: isOver ? 0.9 : 0.7,
            borderRadius: 'base',
            alignItems: 'center',
            justifyContent: 'center',
            transitionProperty: 'common',
            transitionDuration: '0.15s',
          }}
        />
        <Flex
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            w: 'full',
            h: 'full',
            opacity: isOver ? 1 : 0.9,
            alignItems: 'center',
            justifyContent: 'center',
            transitionProperty: 'common',
            transitionDuration: '0.15s',
          }}
        >
          <Text sx={{ fontSize: '2xl', fontWeight: 600, color: 'base.200' }}>
            Drop Image
          </Text>
        </Flex>
        <Flex
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            w: 'full',
            h: 'full',
            opacity: isOver ? 1 : 0.7,
            borderWidth: 2,
            borderColor: 'base.500',
            borderRadius: 'base',
            borderStyle: 'dashed',
            transitionProperty: 'common',
            transitionDuration: '0.15s',
          }}
        ></Flex>
      </Flex>
    </motion.div>
  );
};

const ImageFallback = () => (
  <Flex
    sx={{
      w: 'full',
      h: 'full',
      alignItems: 'center',
      justifyContent: 'center',
      minH: PLACEHOLDER_MIN_HEIGHT,
      color: 'base.400',
      bg: 'base.850',
      borderRadius: 'base',
    }}
  >
    <Spinner size="xl" />
  </Flex>
);
