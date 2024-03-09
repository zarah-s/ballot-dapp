import { Box, Button, Card, Flex, Text, TextField } from "@radix-ui/themes";
import { useRef } from "react";

const DelegateVote = ({ to, handleDelegate }) => {
  const inputRef = useRef();

  return (
    <Card size="2" style={{ width: 425 }}>
      <Flex gap="" align="center">
        <Box width={"100%"}>
          <Flex direction="column" gap="3">
            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                Delegate&apos;s Address
              </Text>
              <TextField.Input
                ref={inputRef}
                placeholder="Enter Delegate's Address"
              />
            </label>
            <Button
              onClick={() => handleDelegate(inputRef.current?.value?.trim())}
            >
              Delegate vote
            </Button>
          </Flex>
        </Box>
      </Flex>
    </Card>
  );
};

export default DelegateVote;
