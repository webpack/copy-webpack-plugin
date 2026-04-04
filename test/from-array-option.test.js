import path from "node:path";

import { runEmit } from "./helpers/run";

const FIXTURES_DIR = path.join(__dirname, "fixtures");

const FIXTURES_DIR_NORMALIZED = FIXTURES_DIR.replaceAll("\\", "/");

describe("from option as array", () => {
  it("should copy multiple files from array", (done) => {
    runEmit({
      expectedAssetKeys: ["directoryfile.txt", "file.txt"],
      patterns: [
        {
          from: ["file.txt", "directory/directoryfile.txt"],
        },
      ],
    })
      .then(done)
      .catch(done);
  });

  it("should copy files from array with absolute paths", (done) => {
    runEmit({
      expectedAssetKeys: ["directoryfile.txt", "file.txt"],
      patterns: [
        {
          from: [
            path.join(FIXTURES_DIR, "file.txt"),
            path.join(FIXTURES_DIR, "directory/directoryfile.txt"),
          ],
        },
      ],
    })
      .then(done)
      .catch(done);
  });

  it("should copy files from array to specific directory", (done) => {
    runEmit({
      expectedAssetKeys: ["dist/file.txt", "dist/directoryfile.txt"],
      patterns: [
        {
          from: ["file.txt", "directory/directoryfile.txt"],
          to: "dist",
        },
      ],
    })
      .then(done)
      .catch(done);
  });

  it("should handle missing files with noErrorOnMissing", (done) => {
    runEmit({
      expectedAssetKeys: ["file.txt"],
      patterns: [
        {
          from: ["file.txt", "nonexistent.txt"],
          noErrorOnMissing: true,
        },
      ],
    })
      .then(done)
      .catch(done);
  });

  it("should error on missing files by default", (done) => {
    runEmit({
      expectedAssetKeys: ["file.txt"],
      expectedErrors: [
        new Error(
          `unable to locate '${FIXTURES_DIR_NORMALIZED}/nonexistent.txt' glob`,
        ),
      ],
      patterns: [
        {
          from: ["file.txt", "nonexistent.txt"],
        },
      ],
    })
      .then(done)
      .catch(done);
  });

  it("should apply filter to all files in array", (done) => {
    runEmit({
      expectedAssetKeys: ["file.txt"],
      patterns: [
        {
          from: ["file.txt", "directory/directoryfile.txt"],
          filter: (resource) => path.basename(resource) === "file.txt",
        },
      ],
    })
      .then(done)
      .catch(done);
  });

  it("should apply transform to all files in array", (done) => {
    runEmit({
      expectedAssetKeys: ["directoryfile.txt", "file.txt"],
      expectedAssetContent: {
        "file.txt": "transformed: new",
        "directoryfile.txt": "transformed: new",
      },
      patterns: [
        {
          from: ["file.txt", "directory/directoryfile.txt"],
          transform: (content) => `transformed: ${content.toString()}`,
        },
      ],
    })
      .then(done)
      .catch(done);
  });

  it("should handle empty array gracefully", (done) => {
    runEmit({
      expectedAssetKeys: [],
      patterns: [
        {
          from: [],
        },
      ],
    })
      .then(done)
      .catch(done);
  });

  it("should handle single item array (backward compatibility)", (done) => {
    runEmit({
      expectedAssetKeys: ["file.txt"],
      patterns: [
        {
          from: ["file.txt"],
        },
      ],
    })
      .then(done)
      .catch(done);
  });

  it("should work with filter in array", (done) => {
    runEmit({
      expectedAssetKeys: ["file.txt"],
      patterns: [
        {
          from: ["file.txt", "directory/directoryfile.txt"],
          filter: (resource) => path.basename(resource) === "file.txt",
        },
      ],
    })
      .then(done)
      .catch(done);
  });

  it('should copy files when "from" is an array containing a directory', (done) => {
    runEmit({
      expectedAssetKeys: [
        ".dottedfile",
        "directoryfile.txt",
        "nested/deep-nested/deepnested.txt",
        "nested/nestedfile.txt",
      ],
      patterns: [
        {
          from: ["directory"],
        },
      ],
    })
      .then(done)
      .catch(done);
  });
});
